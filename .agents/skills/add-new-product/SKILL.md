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
3. Update root wiring to include the new product:
   - **package.json** — add exports for `./<product_name>/kit` and `./<product_name>/web3js` (mirror existing products).
   - **Cargo.toml** — add:
     - the Rust crate path to `[workspace].members`
     - a `[workspace.dependencies]` entry: `jupiter-<product_name>-sdk = { path = "src/products/<product_name>/rust", version = "<workspace version>" }`
     - an optional feature: `<product_name> = ["dep:jupiter-<product_name>-sdk"]`
     - an optional dependency: `jupiter-<product_name>-sdk = { workspace = true, optional = true }`
   - **src/lib.rs** — re-export the crate behind the matching feature flag.
   - **justfile** — add `cargo publish -p jupiter-<product_name>-sdk --allow-dirty` before the umbrella crate publish.
   - **README.md** — add `` `<product_name>` `` to the Products list under Flavors (keep alphabetical order).
4. Make sure `bun run build` and `bun run typecheck` are green.
   - If typecheck fails for the product SDK (e.g. incorrect PDA seeds or account defaults from the Anchor IDL), add an optional `src/products/<product_name>/generate-codama-idl.ts` that builds from `idl/anchor.json` and applies Codama-tree overrides. Remove `idl/codama.json` (or run `bun run generate:codama-idl <product_name>`), then re-run `bun run generate <product_name>` so the product script is used. See `src/products/offerbook/` for the pattern.
5. Commit using message `feat: add <product_name>`.
