---
name: add-new-product
description: >-
  Add a new Jupiter product SDK from IDL through generate, root package wiring,
  build, and commit. Use when adding a product, scaffolding
  src/products/<name>, or running bun run generate for a new product.
---

# Add a New Product

1. Create the product directory: `src/products/<product_name>/idl/`.
2. Add `anchor.json` or `codama.json` under that `idl/` directory.
   - Prefer `anchor.json` when you have an Anchor IDL; `bun run generate` will create `codama.json` if it is missing.
   - If the Anchor IDL is pre-v0.30, convert it into post-v0.30 spec using `anchor idl convert` before generating SDK.
   - If `codama.json` already exists, generation skips the Codama IDL step and renders clients from it.
3. Run `bun run generate <product_name>`.
4. Update root wiring to include the new product:
   - **package.json** — add exports for `./<product_name>/kit` and `./<product_name>/web3js` (mirror existing products).
   - **Cargo.toml** — add:
     - the Rust crate path to `[workspace].members`
     - a `[workspace.dependencies]` entry: `jupiter-<product_name>-sdk = { path = "src/products/<product_name>/rust", version = "<workspace version>" }`
     - an optional feature: `<product_name> = ["dep:jupiter-<product_name>-sdk"]`
     - an optional dependency: `jupiter-<product_name>-sdk = { workspace = true, optional = true }`
   - **src/lib.rs** — re-export the crate behind the matching feature flag.
   - **README.md** — add `` `<product_name>` `` to the Products list under Flavors (keep alphabetical order).
5. Make sure `bun run build` and `bun run typecheck` are green.
   - If typecheck fails for the product SDK (e.g. incorrect PDA seeds or account defaults from the Anchor IDL), add an optional `src/products/<product_name>/generate-codama-idl.ts` that builds from `idl/anchor.json` and applies Codama-tree overrides. Remove `idl/codama.json` (or run `bun run generate:codama-idl <product_name>`), then re-run `bun run generate <product_name>` so the product script is used. See `src/products/offerbook/` for the pattern.
   - If Rust client generation needs product-specific renderer options (e.g. `traitOptions`), add an optional `src/products/<product_name>/generate-clients.ts`. `bun run generate` / `generate:clients` prefer it over the shared script. See `src/products/perps/` for the pattern.
6. If the product has any custom SDK generation scripts (`generate-codama-idl.ts`, `generate-clients.ts`, etc.), add `src/products/<product_name>/README.md` documenting what each script overrides and how to run it (direct path and shared entrypoint). Follow the style in `src/products/offerbook/README.md`.
7. Commit using message `feat: add <product_name>`.
