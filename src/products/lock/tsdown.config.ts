import { defineConfig } from "tsdown";
import rootConfig from "../../../tsdown.config.ts";

const { workspace: _workspace, tsconfig: _tsconfig, ...base } = rootConfig;

export default defineConfig({
  ...base,
  tsconfig: "../../../tsconfig.build.json",
});
