import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { resolve } from "node:path";
import { createFromRoot } from "codama";
import { formatFile } from "./format-file";
import { resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate-codama-idl.ts <product-name>");
}

const productDir = resolveProductDir(productName);
const productScriptPath = resolve(productDir, "generate-codama-idl.ts");

if (await Bun.file(productScriptPath).exists()) {
  console.log(`Using product Codama IDL script: ${productScriptPath}`);
  await Bun.$`bun ${productScriptPath}`;
  process.exit(0);
}

const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

const anchorIdlFile = Bun.file(anchorIdlPath);
if (!(await anchorIdlFile.exists())) {
  throw new Error(`Failed to load Anchor IDL: ${anchorIdlPath} does not exist`);
}

const anchorIdl = await anchorIdlFile.json();
const codama = createFromRoot(rootNodeFromAnchor(anchorIdl));
await Bun.write(codamaIdlPath, codama.getJson());
await formatFile(codamaIdlPath);
console.log(`Wrote ${codamaIdlPath}`);
