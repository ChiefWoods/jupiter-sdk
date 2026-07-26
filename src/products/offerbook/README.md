# Offerbook

## Custom Codama IDL generation

The published Anchor IDL has incorrect PDA seeds. Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then overrides:

| PDA     | Correct seeds                        |
| ------- | ------------------------------------ |
| `loan`  | `["loan", offer, u64(fillIndex)]`    |
| `offer` | `["offer", signer, u64(offerIndex)]` |

It also clears auto-derive defaults on create/fill instructions for these accounts, since the index seeds are not instruction arguments — callers should pass the account or use `findLoanPda` / `findOfferPda`.

```sh
bun src/products/offerbook/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl offerbook
```
