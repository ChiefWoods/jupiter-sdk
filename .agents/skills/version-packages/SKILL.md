---
name: version-packages
description: >-
  Use when bumping, tagging, releasing, or publishing jupiter-sdk (npm) or
  jupiter-program-sdk (crates.io). There is no Changeset; versions are set by
  hand. Use when the user asks to version, bump, release, or publish.
---

# Version Packages for Publish

There is no Changeset (or similar) for JS or Rust. Version by hand, then tag.
JS (`jupiter-sdk`) and Rust (`jupiter-program-sdk`) are independent publishes.
Bump only the registry being released unless asked to bump both.

Do not change product `src/products/*/package.json` versions (`0.0.0`, `private: true`) or IDL versions.

## Semver

Ask if the bump type is unclear. Read the current version from root `package.json` and/or `[workspace.package]` in `Cargo.toml`.

| Bump  | When                                      |
| ----- | ----------------------------------------- |
| patch | bugfix, regen, docs-only SDK change       |
| minor | new product, new public API, non-breaking |
| major | breaking public API                       |

## npm (`jupiter-sdk`)

1. Set `version` in root `package.json` only. Do not edit `bun.lock`.
2. Commit: `chore: jupiter-sdk@v<version>`
3. Tag that commit: `jupiter-sdk@v<version>` (must equal `package.json` `version`)

## crates.io (`jupiter-program-sdk`)

1. In root `Cargo.toml`, set the new version in:
   - `[workspace.package] version`
   - every `version = "..."` under `[workspace.dependencies]`
     Product crates use `version.workspace = true` — leave those files alone.
2. Run `cargo check --workspace --all-features` so `Cargo.lock` workspace package versions update.
3. Commit: `chore: jupiter-program-sdk@v<version>`
4. Tag that commit: `jupiter-program-sdk@v<version>` (must equal `[workspace.package] version`)

## Both

Two commits and two tags (JS then Rust, matching prior releases). Do not share a tag.

## Do not

- Add Changesets, `npm version`, or `cargo set-version` unless asked
- `npm publish` / `cargo publish` locally (trusted publishing via CI is the only publish path)
- Tag a version that does not match the bumped files
- Commit unless the user asked to version/release
