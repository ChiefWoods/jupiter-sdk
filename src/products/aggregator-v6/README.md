# Aggregator V6

## Custom Codama IDL generation

The Aggregator V6 IDL defines both a route-plan type and an event that the
Web3.js renderer exposes as `Swap`. Use
[`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared
script. It builds the Codama tree, then renames the
route-plan defined type from `swap` to `swapType`, including all links to it.
The generated clients therefore expose the route-plan type as `SwapType` and
retain `Swap` for the event in `events/swapEvent.ts`.

```sh
bun src/products/aggregator-v6/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl aggregator-v6
```
