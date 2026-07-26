# Lend Borrow

## Custom Codama IDL generation

The published Anchor IDL needs Codama-tree overrides before client generation. Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then:

| Override                                                                                                                                  | Why                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rebalanceDex` / `rebalanceDexWithAmounts`: mark `supplyToken`, `borrowToken`, `supplyTokenProgram`, and `borrowTokenProgram` as required | Those instructions mark the mint/token-program accounts optional (T2–T4 vaults omit one leg), but still attach ATA PDA defaults for `rebalancerSupplyTokenAccount` / `rebalancerBorrowTokenAccount` that seed from them. Codama refuses optional accounts as PDA seeds. |
| `operatePerfectDexAmounts` docs                                                                                                           | Codama's Rust renderer treats `i128::MIN` in docs as a missing Cargo dependency; rewrite the docs to avoid the false positive.                                                                                                                                          |

```sh
bun src/products/lend-borrow/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl lend-borrow
```
