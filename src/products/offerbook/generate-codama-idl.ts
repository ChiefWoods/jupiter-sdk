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

const clearLoanPdaDefault = {
  accounts: {
    loan: { defaultValue: null },
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
  ]),
);

// fillIndex is not an instruction argument, so loan cannot be auto-derived from accounts/args.
// Clear the stale IDL defaults (duplicate offer seeds) and let callers pass loan or use findLoanPda.
codama.update(
  updateInstructionsVisitor({
    fillNonFungibleCollateralOffer: clearLoanPdaDefault,
    fillNonFungiblePrincipalOffer: clearLoanPdaDefault,
    fillTokenCollateralOffer: clearLoanPdaDefault,
    fillTokenPrincipalOffer: clearLoanPdaDefault,
  }),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
