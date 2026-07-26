# Offerbook

## Custom Codama IDL generation

The published Anchor IDL has incorrect PDA seeds. Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then overrides:

| PDA / account             | Correct seeds                                           |
| ------------------------- | ------------------------------------------------------- |
| `loan`                    | `["loan", offer, u64(fillIndex)]`                       |
| `offer`                   | `["offer", signer, u64(offerIndex)]`                    |
| `userEscrowTokenAccount`  | ATA `[signerUser, tokenProgram, mint]`                  |
| `protocolFeeTokenAccount` | ATA `[feeAuthority, tokenProgram, mint]` (not `config`) |

It also clears auto-derive defaults where seeds cannot be resolved from instruction accounts (`offerIndex` / `fillIndex`, and protocol fee ATAs whose owner is `feeAuthority`). Callers should pass those accounts or use the PDA helpers.

```sh
bun src/products/offerbook/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl offerbook
```
