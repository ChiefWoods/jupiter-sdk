# Jupiter SDK

> [!WARNING]
> This is **not** an official package by the Jupiter team. It is an independent, community-maintained project.

Codama-generated SDKs for on-chain Jupiter programs. Each product ships three client flavors:

| Flavor     | Import / crate                                 | Stack                                                                                | Registry                                                                                                              |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **kit**    | `jupiter-sdk/<product>/kit`                    | [`@solana/kit`](https://www.npmjs.com/package/@solana/kit)                           | [![npm](https://img.shields.io/npm/v/jupiter-sdk.svg)](https://www.npmjs.com/package/jupiter-sdk)                     |
| **web3js** | `jupiter-sdk/<product>/web3js`                 | [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) v3 (`3.0.0-rc.x`) | [![npm](https://img.shields.io/npm/v/jupiter-sdk.svg)](https://www.npmjs.com/package/jupiter-sdk)                     |
| **rust**   | `jupiter-program-sdk` with feature `<product>` | Solana program / CPI client                                                          | [![Crates.io](https://img.shields.io/crates/v/jupiter-program-sdk.svg)](https://crates.io/crates/jupiter-program-sdk) |

### Products

- `aggregator-v6`
- `governance`
- `lend-borrow`
- `lend-dex`
- `lend-earn`
- `lend-flash-loan`
- `lend-lending-reward-rate-model`
- `lend-liquidity`
- `lend-oracle`
- `lock`
- `offerbook`
- `perps`
- `prediction`
- `rewards-hub`
- `stablecoin`

## Usage

Examples below use **offerbook**. Swap the product name for any other generated product (e.g. `prediction`).

### Kit (`@solana/kit`)

```bash
bun add jupiter-sdk @solana/kit
```

```ts
import {
  getCreateUserInstructionAsync,
  OFFERBOOK_PROGRAM_ADDRESS,
} from "jupiter-sdk/offerbook/kit";
import type { Address, TransactionSigner } from "@solana/kit";

const instruction = await getCreateUserInstructionAsync({
  signer, // TransactionSigner
  config: configAddress as Address,
});

console.log(OFFERBOOK_PROGRAM_ADDRESS, instruction);
```

### Web3.js (`@solana/web3.js`)

```bash
bun add jupiter-sdk @solana/web3.js@3.0.0-rc.2
```

```ts
import { createCreateUserInstruction, OFFERBOOK_PROGRAM_ID } from "jupiter-sdk/offerbook/web3js";
import { Address } from "@solana/web3.js";

const instruction = await createCreateUserInstruction({
  signer: signerAddress,
  config: configAddress,
  systemProgram: new Address("11111111111111111111111111111111"),
});

console.log(OFFERBOOK_PROGRAM_ID, instruction);
```

### Rust

```bash
cargo add jupiter-program-sdk -F offerbook
```

```rust
use jupiter_program_sdk::offerbook::generated::instructions::CreateUserBuilder;
use solana_address::Address;

let instruction = CreateUserBuilder::new()
    .signer(signer)
    .signer_user(signer_user)
    .config(config)
    .instruction();
```

## Setup

```bash
bun install
bun run build
```

## Generate

Regenerate a product SDK from its IDL under `src/products/<product>/idl/`. Prefer an Anchor IDL (`anchor.json`); Codama IDL (`codama.json`) is created on first generate if missing. If `codama.json` already exists, the Codama IDL step is skipped.

```bash
bun run generate <product>
# e.g. bun run generate offerbook
```

That runs, in order:

1. `generate:codama-idl` — Anchor IDL → `idl/codama.json` (skipped when Codama IDL exists)
2. `generate:cargo-toml` — product Rust `Cargo.toml` + `lib.rs`
3. `generate:clients` — kit, web3js, and rust clients under `kit/`, `web3js/`, and `rust/`
4. `generate:package-json` — product `package.json`
5. `generate:tsconfig-json` — product `tsconfig.json`
6. `generate:tsdown` — product `tsdown.config.ts`

Run a single step when you only need that output:

```bash
bun run generate:codama-idl <product>
bun run generate:clients <product>
bun run generate:cargo-toml <product>
bun run generate:package-json <product>
bun run generate:tsconfig-json <product>
bun run generate:tsdown <product>
```

Some products ship optional overrides (`src/products/<product>/generate-codama-idl.ts` and/or `generate-clients.ts`). The shared scripts prefer those when present. See the product README (e.g. [`offerbook`](./src/products/offerbook/README.md)) for what each override does.

## Adding a New Product

> [!NOTE]
> Only the root packages (`jupiter-sdk` / `jupiter-program-sdk`) are published. Individual product SDKs under `src/products/` are not published separately.

See [.agents/skills/add-new-product/SKILL.md](./.agents/skills/add-new-product/SKILL.md)
