import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { createFromRoot, updateDefinedTypesVisitor, updateInstructionsVisitor } from "codama";
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

/**
 * rebalanceDex / rebalanceDexWithAmounts mark supply/borrow mint + token program
 * accounts optional (T2–T4 vaults omit one leg), but still attach ATA PDA defaults
 * for rebalancerSupplyTokenAccount / rebalancerBorrowTokenAccount that seed from
 * those accounts. Codama refuses optional accounts as PDA seeds — mark the seed
 * accounts required so client generation can keep the ATA defaults.
 */
const requiredRebalanceSeedAccounts = {
  accounts: {
    supplyToken: { isOptional: false },
    borrowToken: { isOptional: false },
    supplyTokenProgram: { isOptional: false },
    borrowTokenProgram: { isOptional: false },
  },
} as const;

codama.update(
  updateInstructionsVisitor({
    rebalanceDex: requiredRebalanceSeedAccounts,
    rebalanceDexWithAmounts: requiredRebalanceSeedAccounts,
  }),
);

// Codama's Rust renderer scans `crate::path` tokens and treats `i128::MIN` in docs
// as a missing Cargo dependency. Rewrite to avoid the false positive.
codama.update(
  updateDefinedTypesVisitor({
    operatePerfectDexAmounts: {
      docs: ["Pass the minimum i128 value to request max-withdrawal / max-payback."],
    },
  }),
);

await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
