import { resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate-tsdown.ts <product-name>");
}

const productDir = resolveProductDir(productName);

if (!(await Bun.file(`${productDir}/idl/anchor.json`).exists())) {
  throw new Error(`Failed to find product IDL: ${productDir}/idl/anchor.json does not exist`);
}

const tsdownConfig = `import { defineConfig } from "tsdown";
import rootConfig from "../../../tsdown.config.ts";

const { workspace: _workspace, tsconfig: _tsconfig, ...base } = rootConfig;

export default defineConfig({
  ...base,
  tsconfig: "../../../tsconfig.build.json",
});
`;

const tsdownConfigPath = `${productDir}/tsdown.config.ts`;
await Bun.write(tsdownConfigPath, tsdownConfig);
console.log(`Wrote ${tsdownConfigPath}`);
