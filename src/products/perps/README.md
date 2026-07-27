# Perps

## Custom Codama IDL generation

The published Anchor IDL names the Instructions sysvar account `instruction`. Codama's Rust builder always emits `fn instruction(&self) -> Instruction` to finalize an ix, so an account setter of the same name duplicates the method (`E0592`). Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then renames:

| Account       | Override            | Why                                                                      |
| ------------- | ------------------- | ------------------------------------------------------------------------ |
| `instruction` | `instructionSysvar` | Avoids colliding with the Rust builder's finalize `instruction()` method |

Affected instructions: `increasePositionPreSwap`, `instantIncreasePositionPreSwap`, `swapWithTokenLedger`.

```sh
bun src/products/perps/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl perps
```

## Custom client generation

Some perps types include `f32` fields. Codama's Rust renderer derives `Eq` by default, but `f32` does not implement `Eq`. Use [`generate-clients.ts`](./generate-clients.ts) instead of the shared script. It renders kit / web3js / rust clients as usual, then drops `Eq` (keeps `PartialEq`) via `traitOptions.overrides` for:

| Node                       | Why                                                 |
| -------------------------- | --------------------------------------------------- |
| `priceImpactBuffer`        | Contains `exponent: f32`                            |
| `custody`                  | Embeds `PriceImpactBuffer`                          |
| `addCustody`               | Instruction args include `priceImpactExponent: f32` |
| `setCustodyConfig`         | Instruction args include `priceImpactExponent: f32` |
| `operatorSetCustodyConfig` | Instruction args include `priceImpactExponent: f32` |

```sh
bun src/products/perps/generate-clients.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:clients perps
```
