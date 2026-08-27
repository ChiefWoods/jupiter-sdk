import { resolve } from "node:path";
import { assertProductIdl, resolveProductDir } from "./utils";

const productName = Bun.argv[2];
if (!productName) {
  throw new Error("Usage: bun src/scripts/generate.ts <product-name>");
}

const productDir = resolveProductDir(productName);
const anchorIdlPath = `${productDir}/idl/anchor.json`;
const codamaIdlPath = `${productDir}/idl/codama.json`;

await assertProductIdl(productDir);

const hasAnchorIdl = await Bun.file(anchorIdlPath).exists();
const productCodamaIdlScript = `${productDir}/generate-codama-idl.ts`;
const hasProductCodamaIdlScript = await Bun.file(productCodamaIdlScript).exists();
const productClientsScript = `${productDir}/generate-clients.ts`;
const hasProductClientsScript = await Bun.file(productClientsScript).exists();
const steps = [
  ...(hasAnchorIdl ? ["generate-codama-idl.ts"] : []),
  "generate-cargo-toml.ts",
  "generate-clients.ts",
  "generate-package-json.ts",
  "generate-tsconfig-json.ts",
  "generate-tsdown.ts",
];

if (!hasAnchorIdl) {
  console.log(`Skipping Codama IDL generation (no Anchor IDL; using ${codamaIdlPath})`);
}

for (const step of steps) {
  const scriptPath =
    step === "generate-codama-idl.ts" && hasProductCodamaIdlScript
      ? productCodamaIdlScript
      : step === "generate-clients.ts" && hasProductClientsScript
        ? productClientsScript
        : resolve(import.meta.dir, step);
  const isProductScript =
    scriptPath === productCodamaIdlScript || scriptPath === productClientsScript;
  console.log(`\n→ ${step}${isProductScript ? " (product)" : ""}`);
  await Bun.$`bun ${scriptPath} ${productName}`;
}

console.log(`\nGenerated product SDK for ${productName}`);
