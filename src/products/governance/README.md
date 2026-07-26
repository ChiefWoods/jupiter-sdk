# Governance

## Custom Codama IDL generation

The published Anchor IDL needs Codama-tree overrides before client generation. Use [`generate-codama-idl.ts`](./generate-codama-idl.ts) instead of the shared script. It builds the Codama tree from `idl/anchor.json`, then:

| Override                          | Why                                                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `govern` program `publicKey`      | Older Anchor IDL omits `address`; Codama would emit an empty pubkey that breaks the Rust client. Set to `GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY`. |
| `Governor.smartWallet` field docs | Codama's Rust renderer treats `smart_wallet::SmartWallet` in docs as a missing Cargo dependency; drop those doc lines to avoid the false positive.      |

```sh
bun src/products/governance/generate-codama-idl.ts
# or, via the shared entrypoint (delegates to this script):
bun run generate:codama-idl governance
```
