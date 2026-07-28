import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum VaultStatus {
    Enabled,
    Disabled,
}

export type VaultStatusArgs = VaultStatus;

export function getVaultStatusEncoder(): Encoder<VaultStatusArgs> {
    return getEnumEncoder(VaultStatus);
}

export function getVaultStatusDecoder(): Decoder<VaultStatus> {
    return getEnumDecoder(VaultStatus);
}

export function getVaultStatusCodec(): Codec<VaultStatusArgs, VaultStatus> {
    return combineCodec(getVaultStatusEncoder(), getVaultStatusDecoder());
}
