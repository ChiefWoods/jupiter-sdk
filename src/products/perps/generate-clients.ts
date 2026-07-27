import { renderVisitor as renderJavaScriptVisitor } from "@codama/renderers-js";
import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import { createFromJson } from "codama";
import { renderVisitor as renderWeb3jsVisitor } from "renderers-web3js";

const productDir = import.meta.dir;
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

/** f32 fields cannot derive Eq; keep PartialEq only for those nodes. */
const WITHOUT_EQ = [
  "borsh::BorshSerialize",
  "borsh::BorshDeserialize",
  "Clone",
  "Debug",
  "PartialEq",
] as const;

codama.accept(
  renderRustVisitor(`${productDir}/rust`, {
    // Codama's Rust renderer generates malformed Cargo.toml, hence we use generate-cargo-toml.ts instead
    syncCargoToml: false,
    formatCode: true,
    deleteFolderBeforeRendering: true,
    anchorTraits: true,
    traitOptions: {
      overrides: {
        priceImpactBuffer: [...WITHOUT_EQ],
        custody: [...WITHOUT_EQ], // embeds PriceImpactBuffer
        addCustody: [...WITHOUT_EQ],
        setCustodyConfig: [...WITHOUT_EQ],
        operatorSetCustodyConfig: [...WITHOUT_EQ],
      },
    },
  }),
);

console.log("Wrote clients for perps");
