import { formatFile } from "./format-file";
import { assertProductIdl, resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate-tsconfig-json.ts <product-name>");
}

const productDir = resolveProductDir(productName);
await assertProductIdl(productDir);

const tsconfig = {
  $schema: "https://json.schemastore.org/tsconfig",
  extends: "../../../tsconfig.json",
  compilerOptions: {
    verbatimModuleSyntax: false,
    noUncheckedIndexedAccess: false,
    strictNullChecks: false,
  },
  include: ["kit", "web3js"],
  exclude: ["dist", "rust", "idl"],
};

const tsconfigPath = `${productDir}/tsconfig.json`;
await Bun.write(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);
await formatFile(tsconfigPath);
console.log(`Wrote ${tsconfigPath}`);
