# Jupiter SDK

> [!WARNING]
> This is **not** an official package by the Jupiter team. It is an independent, community-maintained project.

Codama-generated SDKs for on-chain Jupiter programs. Each product ships three client flavors:

| Flavor     | Import / crate                                 | Stack                                                                                |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| **kit**    | `jupiter-sdk/<product>/kit`                    | [`@solana/kit`](https://www.npmjs.com/package/@solana/kit)                           |
| **web3js** | `jupiter-sdk/<product>/web3js`                 | [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) v3 (`3.0.0-rc.x`) |
| **rust**   | `jupiter-program-sdk` with feature `<product>` | Solana program / CPI client                                                          |

### Products

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
- `prediction`
- `stablecoin`

## Setup

```bash
bun install
bun run build
```

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

```toml
[dependencies]
jupiter-program-sdk = { version = "0.0.0", features = ["offerbook"] }
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

Enable a product with its Cargo feature (`offerbook`, `prediction`, …). The umbrella crate re-exports each client as `jupiter_program_sdk::<product>`.

## Development

```bash
bun run generate <product_name>   # regenerate clients from IDL
bun run build                     # turbo build (TS + product packages)
```

## Adding a New Product

See [.agents/skills/add-new-product/SKILL.md](./.agents/skills/add-new-product/SKILL.md)
