# Offerbook

## Custom Codama IDL generation

The published Anchor IDL defines the loan PDA seeds as `["loan", offer, offer]`, which is wrong on-chain and produces invalid generated TypeScript (duplicate `offer` seed names).

Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then overrides the loan PDA to the correct seeds:

`["loan", offer, u64(fillIndex)]`

It also clears auto-derive defaults on fill instructions for the loan account, since `fillIndex` is not an instruction argument — callers should pass `loan` or use `findLoanPda`.

```sh
bun src/products/offerbook/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl offerbook
```
