import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import {
  bottomUpTransformerVisitor,
  constantPdaSeedNodeFromString,
  createFromRoot,
  numberTypeNode,
  pdaNode,
  publicKeyTypeNode,
  updateInstructionsVisitor,
  variablePdaSeedNode,
} from "codama";
import { formatFile } from "../../scripts/format-file";

const productDir = import.meta.dir;
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

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
  ]),
);

// fillIndex / offerIndex are not instruction arguments, so these PDAs cannot be auto-derived.
codama.update(
  updateInstructionsVisitor({
    fillNonFungibleCollateralOffer: clearLoanPdaDefault,
    fillNonFungiblePrincipalOffer: clearLoanPdaDefault,
    fillTokenCollateralOffer: clearLoanPdaDefault,
    fillTokenPrincipalOffer: clearLoanPdaDefault,
    createNftCollateralOffer: clearOfferPdaDefault,
    createNftPrincipalOffer: clearOfferPdaDefault,
    createTokenCollateralOffer: clearOfferPdaDefault,
    createTokenPrincipalOffer: clearOfferPdaDefault,
  }),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
