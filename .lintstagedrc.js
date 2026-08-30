/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "**/*.{ts,tsx,js,jsx,json,css,md}": "bunx oxfmt --no-error-on-unmatched-pattern",
  ".agents/**/*.md": "bunx oxfmt --no-error-on-unmatched-pattern",
  "**/*.{ts,tsx,js,jsx}": "bunx oxlint --no-error-on-unmatched-pattern",
  "**/*.rs": () => "cargo fmt",
};
