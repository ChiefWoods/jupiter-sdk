# Lock

## Custom Codama IDL generation

The published Anchor IDL has an incorrect ATA PDA for `claim.escrowToken`. Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then clears the broken auto-derive default:

| PDA / account       | Issue                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claim.escrowToken` | Anchor emits seeds `[escrow, TOKEN_PROGRAM, escrow]` instead of `[escrow, TOKEN_PROGRAM, mint]`, because `mint` lives on escrow account data (`associated_token::mint = escrow.load()?.token_mint`) and is not an instruction account. Codama merges this with `claimV2`'s correct `{escrow, tokenProgram, tokenMint}` seeds, so auto-derive typechecks fail. |

Callers must pass `escrowToken` (derive via ATA using `escrow.tokenMint`), matching jup-lock / locker-sdk.

```sh
bun src/products/lock/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl lock
```
