import { formatFile } from "./format-file";
import { resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate-package-json.ts <product-name>");
}

const productDir = resolveProductDir(productName);

if (!(await Bun.file(`${productDir}/idl/anchor.json`).exists())) {
  throw new Error(`Failed to find product IDL: ${productDir}/idl/anchor.json does not exist`);
}

const packageJson = {
  name: `jupiter-${productName}-sdk`,
  private: true,
  version: "0.0.0",
  type: "module",
  files: ["dist"],
  scripts: {
    build: "tsdown",
    typecheck: "tsc --noEmit",
  },
  exports: {
    "./kit": "./dist/kit/index.js",
    "./web3js": "./dist/web3js/index.js",
  },
  peerDependencies: {
    "@solana/kit": "^6.10.0",
    "@solana/web3.js": "3.0.0-rc.2",
  },
  peerDependenciesMeta: {
    "@solana/kit": { optional: true },
    "@solana/web3.js": { optional: true },
  },
};

const packageJsonPath = `${productDir}/package.json`;
await Bun.write(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
await formatFile(packageJsonPath);
console.log(`Wrote ${packageJsonPath}`);
