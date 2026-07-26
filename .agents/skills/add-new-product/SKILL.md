---
name: add-new-product
description: >-
  Add a new Jupiter product SDK from IDL through generate, root package wiring,
  build, and commit. Use when adding a product, scaffolding
  src/products/<name>, or running bun run generate for a new product.
---

# Add a New Product

1. Create `anchor.json` or `codama.json` under `src/products/<product_name>/idl/`.
   - Prefer `anchor.json` when you have an Anchor IDL; `bun run generate` will create `codama.json` if it is missing.
   - If `codama.json` already exists, generation skips the Codama IDL step and renders clients from it.
2. Run `bun run generate <product_name>`.
3. Update root `package.json` and `Cargo.toml` to include the new product:
   - **package.json** — add exports for `./<product_name>/kit` and `./<product_name>/web3js` (mirror existing products).
   - **Cargo.toml** — add the Rust crate to `[workspace].members`, an optional feature, and an optional path dependency.
   - **src/lib.rs** — re-export the crate behind the matching feature flag.
4. Make sure `bun run build` is green.
5. Commit using message `feat: add <product_name>`.
