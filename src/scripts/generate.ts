import { resolve } from "node:path";
import { resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate.ts <product-name>");
}

const productDir = resolveProductDir(productName);
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

if (!(await Bun.file(anchorIdlPath).exists())) {
  throw new Error(`Failed to find product IDL: ${anchorIdlPath} does not exist`);
}

const hasCodamaIdl = await Bun.file(codamaIdlPath).exists();
const productCodamaIdlScript = `${productDir}/generate-codama-idl.ts`;
const hasProductCodamaIdlScript = await Bun.file(productCodamaIdlScript).exists();
const steps = [
  ...(hasCodamaIdl ? [] : ["generate-codama-idl.ts"]),
  "generate-clients.ts",
  "generate-cargo-toml.ts",
  "generate-package-json.ts",
  "generate-tsconfig-json.ts",
  "generate-tsdown.ts",
];

if (hasCodamaIdl) {
  console.log(`Skipping Codama IDL generation (${codamaIdlPath} already exists)`);
}

for (const step of steps) {
  const scriptPath =
    step === "generate-codama-idl.ts" && hasProductCodamaIdlScript
      ? productCodamaIdlScript
      : resolve(import.meta.dir, step);
  console.log(`\n→ ${step}${scriptPath === productCodamaIdlScript ? " (product)" : ""}`);
  await Bun.$`bun ${scriptPath} ${productName}`;
}

console.log(`\nGenerated product SDK for ${productName}`);
