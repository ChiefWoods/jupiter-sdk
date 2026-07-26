import { renderVisitor as renderJavaScriptVisitor } from "@codama/renderers-js";
import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import { createFromJson } from "codama";
import { resolve } from "node:path";
import { renderVisitor as renderWeb3jsVisitor } from "renderers-web3js";

const productDirArg = Bun.argv[2];
if (!productDirArg) {
  throw new Error("Usage: bun src/scripts/generate-clients.ts <product-directory>");
}

const productDir = resolve(productDirArg);
const codamaIdlPath = `${productDir}/idl/codama.json`;
const codamaIdlFile = Bun.file(codamaIdlPath);

if (!(await codamaIdlFile.exists())) {
  throw new Error(`Failed to load Codama IDL: ${codamaIdlPath} does not exist`);
}

const codama = createFromJson(await codamaIdlFile.text());

await codama.accept(
  renderJavaScriptVisitor(`${productDir}/kit`, {
    kitImportStrategy: "rootOnly",
    syncPackageJson: false,
    formatCode: true,
    deleteFolderBeforeRendering: true,
  }),
);

await codama.accept(
  renderWeb3jsVisitor(`${productDir}/web3js`, {
    syncPackageJson: false,
    formatCode: true,
    deleteFolderBeforeRendering: true,
  }),
);

codama.accept(
  renderRustVisitor(`${productDir}/rust`, {
    syncCargoToml: false,
    formatCode: true,
    deleteFolderBeforeRendering: true,
    anchorTraits: true,
  }),
);

console.log(`Wrote clients for ${productDir}`);
