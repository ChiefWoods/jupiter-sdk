import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { createFromRoot, updateInstructionsVisitor } from "codama";
import { formatFile } from "../../scripts/format-file";

const productDir = import.meta.dir;
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

const anchorIdlFile = Bun.file(anchorIdlPath);
if (!(await anchorIdlFile.exists())) {
  throw new Error(`Failed to load Anchor IDL: ${anchorIdlPath} does not exist`);
}

const anchorIdl = await anchorIdlFile.json();
const codama = createFromRoot(rootNodeFromAnchor(anchorIdl));

// Anchor emits a broken ATA PDA for claim.escrowToken: seeds are
// [escrow, TOKEN_PROGRAM, escrow] instead of [escrow, TOKEN_PROGRAM, mint],
// because mint lives on escrow account data (associated_token::mint =
// escrow.load()?.token_mint) and is not an instruction account. Codama merges
// escrowToken helpers with claimV2's correct {escrow, tokenProgram, tokenMint}
// seeds, so auto-derive typechecks fail. Clear the default — callers must pass
// escrowToken (derive via ATA using escrow.tokenMint), matching jup-lock / locker-sdk.
codama.update(
  updateInstructionsVisitor({
    claim: {
      accounts: {
        escrowToken: { defaultValue: null },
      },
    },
  }),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
