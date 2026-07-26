import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import {
  accountValueNode,
  assertIsNode,
  bottomUpTransformerVisitor,
  constantPdaSeedNodeFromString,
  createFromRoot,
  isNode,
  numberTypeNode,
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  updateInstructionsVisitor,
  variablePdaSeedNode,
  type PdaSeedValueNode,
} from "codama";
import { formatFile } from "../../scripts/format-file";

const productDir = import.meta.dir;
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

const ASSOCIATED_TOKEN_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

/** Correct on-chain loan PDA: ["loan", offer, u64(fillIndex)]. The published Anchor IDL wrongly lists offer twice. */
const loanPda = pdaNode({
  name: "loan",
  seeds: [
    constantPdaSeedNodeFromString("utf8", "loan"),
    variablePdaSeedNode("offer", publicKeyTypeNode()),
    variablePdaSeedNode("fillIndex", numberTypeNode("u64")),
  ],
});

/** Correct on-chain offer PDA: ["offer", signer, u64(offerIndex)]. The published Anchor IDL wrongly uses signerUser. */
const offerPda = pdaNode({
  name: "offer",
  seeds: [
    constantPdaSeedNodeFromString("utf8", "offer"),
    variablePdaSeedNode("signer", publicKeyTypeNode()),
    variablePdaSeedNode("offerIndex", numberTypeNode("u64")),
  ],
});

/** ATA seeds for user escrow token accounts: [signerUser, tokenProgram, mint]. */
const userEscrowTokenAccountPda = pdaNode({
  name: "userEscrowTokenAccount",
  programId: ASSOCIATED_TOKEN_PROGRAM_ID,
  seeds: [
    variablePdaSeedNode("signerUser", publicKeyTypeNode()),
    variablePdaSeedNode("tokenProgram", publicKeyTypeNode()),
    variablePdaSeedNode("mint", publicKeyTypeNode()),
  ],
});

const clearLoanPdaDefault = {
  accounts: {
    loan: { defaultValue: null },
  },
} as const;

const clearOfferPdaDefault = {
  accounts: {
    offer: { defaultValue: null },
  },
} as const;

/** Protocol fee ATAs are owned by feeAuthority, not config — and feeAuthority is not an instruction account. */
const clearProtocolFeeTokenAccountDefault = {
  accounts: {
    protocolFeeTokenAccount: { defaultValue: null },
  },
} as const;

/**
 * Escrow ATAs are correct on-chain, but Codama merges them into one helper whose seed
 * property names come from the first instruction. Clear auto-derive instead of renaming seeds.
 */
const clearLenderPrincipalEscrowDefault = {
  accounts: {
    lenderPrincipalEscrow: { defaultValue: null },
  },
} as const;

const clearBorrowerCollateralEscrowDefault = {
  accounts: {
    borrowerCollateralEscrow: { defaultValue: null },
  },
} as const;

const clearLenderCollateralEscrowDefault = {
  accounts: {
    lenderCollateralEscrow: { defaultValue: null },
  },
} as const;

function seedAccountName(
  seeds: readonly PdaSeedValueNode[],
  ...candidates: string[]
): string | undefined {
  for (const candidate of candidates) {
    const match = seeds.find((seed) => seed.name === candidate);
    if (match && isNode(match.value, "accountValueNode")) {
      return match.value.name;
    }
  }
  return undefined;
}

const anchorIdlFile = Bun.file(anchorIdlPath);
if (!(await anchorIdlFile.exists())) {
  throw new Error(`Failed to load Anchor IDL: ${anchorIdlPath} does not exist`);
}

const anchorIdl = await anchorIdlFile.json();
const codama = createFromRoot(rootNodeFromAnchor(anchorIdl));

codama.update(
  bottomUpTransformerVisitor([
    {
      select: "[pdaNode]loan",
      transform: () => loanPda,
    },
    {
      select: "[pdaNode]offer",
      transform: () => offerPda,
    },
    {
      select: "[pdaValueNode]",
      transform: (node) => {
        assertIsNode(node, "pdaValueNode");
        if (!isNode(node.pda, "pdaNode") || node.pda.name !== "userEscrowTokenAccount") {
          return node;
        }

        const signerUser = seedAccountName(node.seeds, "signerUser") ?? "signerUser";
        const tokenProgram = seedAccountName(node.seeds, "tokenProgram") ?? "tokenProgram";
        const mint = seedAccountName(node.seeds, "mint", "nftMint") ?? "mint";

        return pdaValueNode(userEscrowTokenAccountPda, [
          pdaSeedValueNode("signerUser", accountValueNode(signerUser)),
          pdaSeedValueNode("tokenProgram", accountValueNode(tokenProgram)),
          pdaSeedValueNode("mint", accountValueNode(mint)),
        ]);
      },
    },
  ]),
);

const clearFillDefaults = {
  accounts: {
    ...clearLoanPdaDefault.accounts,
    ...clearProtocolFeeTokenAccountDefault.accounts,
    ...clearLenderPrincipalEscrowDefault.accounts,
  },
} as const;

const clearFillTokenDefaults = {
  accounts: {
    ...clearFillDefaults.accounts,
    ...clearBorrowerCollateralEscrowDefault.accounts,
  },
} as const;

// fillIndex / offerIndex are not instruction arguments, so these PDAs cannot be auto-derived.
// Protocol fee token accounts are ATAs of feeAuthority (IDL wrongly uses config); clear broken defaults.
// Escrow ATA defaults are cleared to avoid shared-helper seed-name collisions across instructions.
codama.update(
  updateInstructionsVisitor({
    fillNonFungibleCollateralOffer: clearFillDefaults,
    fillNonFungiblePrincipalOffer: clearFillDefaults,
    fillTokenCollateralOffer: clearFillTokenDefaults,
    fillTokenPrincipalOffer: clearFillTokenDefaults,
    createNftCollateralOffer: clearOfferPdaDefault,
    createNftPrincipalOffer: clearOfferPdaDefault,
    createTokenCollateralOffer: clearOfferPdaDefault,
    createTokenPrincipalOffer: clearOfferPdaDefault,
    claimTokenLoan: {
      accounts: {
        ...clearProtocolFeeTokenAccountDefault.accounts,
        ...clearLenderCollateralEscrowDefault.accounts,
      },
    },
    repayNonFungibleLoan: {
      accounts: {
        ...clearProtocolFeeTokenAccountDefault.accounts,
        ...clearLenderPrincipalEscrowDefault.accounts,
      },
    },
    repayTokenLoan: {
      accounts: {
        ...clearProtocolFeeTokenAccountDefault.accounts,
        ...clearLenderPrincipalEscrowDefault.accounts,
        ...clearBorrowerCollateralEscrowDefault.accounts,
      },
    },
  }),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
