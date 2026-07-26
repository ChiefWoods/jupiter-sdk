import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import", "promise", "vitest"],
  categories: {
    correctness: "error",
  },
  rules: {
    "no-unused-vars": "warn",
  },
  env: {
    builtin: true,
  },
  ignorePatterns: ["generated"],
});
