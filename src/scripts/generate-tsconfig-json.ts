import { resolve } from "node:path";

const productDirArg = Bun.argv[2];
if (!productDirArg) {
  throw new Error("Usage: bun src/scripts/generate-tsconfig-json.ts <product-directory>");
}

const productDir = resolve(productDirArg);

if (!(await Bun.file(`${productDir}/idl/anchor.json`).exists())) {
  throw new Error(`Failed to find product IDL: ${productDir}/idl/anchor.json does not exist`);
}

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
console.log(`Wrote ${tsconfigPath}`);
