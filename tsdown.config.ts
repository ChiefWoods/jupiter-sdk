import { defineConfig } from "tsdown";

export default defineConfig({
  workspace: ["src/products/*"],
  entry: {
    "kit/index": "./kit/src/generated/index.ts",
    "web3js/index": "./web3js/src/generated/index.ts",
  },
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
  platform: "neutral",
  tsconfig: "./tsconfig.build.json",
  deps: {
    neverBundle: [/^@solana\//],
  },
});
