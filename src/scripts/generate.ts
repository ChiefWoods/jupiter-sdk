import { basename, resolve } from "node:path";

const productDirArg = Bun.argv[2];
if (!productDirArg) {
  throw new Error("Usage: bun src/scripts/generate.ts <product-directory>");
}

const productDir = resolve(productDirArg);
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

if (!(await Bun.file(anchorIdlPath).exists())) {
  throw new Error(`Failed to find product IDL: ${anchorIdlPath} does not exist`);
}

const hasCodamaIdl = await Bun.file(codamaIdlPath).exists();
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
  const scriptPath = resolve(import.meta.dir, step);
  console.log(`\n→ ${step}`);
  await Bun.$`bun ${scriptPath} ${productDir}`;
}

console.log(`\nGenerated product SDK for ${basename(productDir)}`);
