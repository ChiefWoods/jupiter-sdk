import { renderVisitor as renderJavaScriptVisitor } from "@codama/renderers-js";
import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import { resolve } from "node:path";
import { createFromJson } from "codama";
import { renderVisitor as renderWeb3jsVisitor } from "renderers-web3js";
import { resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate-clients.ts <product-name>");
}

const productDir = resolveProductDir(productName);
const productScriptPath = resolve(productDir, "generate-clients.ts");

if (await Bun.file(productScriptPath).exists()) {
  console.log(`Using product clients script: ${productScriptPath}`);
  await Bun.$`bun ${productScriptPath}`;
  process.exit(0);
}

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
    // Codama's Rust renderer generates malformed Cargo.toml, hence we use generate-cargo-toml.ts instead
    syncCargoToml: false,
    formatCode: true,
    deleteFolderBeforeRendering: true,
    anchorTraits: true,
  }),
);

console.log(`Wrote clients for ${productName}`);
