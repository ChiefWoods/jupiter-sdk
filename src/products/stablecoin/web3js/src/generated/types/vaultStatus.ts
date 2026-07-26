import { getU8Codec } from '@solana/codecs';

export enum VaultStatus {
    Enabled,
    Disabled,
}

export const vaultStatusCodec = getU8Codec();
