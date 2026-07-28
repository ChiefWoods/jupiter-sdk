import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

/** Col vs debt side for a [`DexPegOracleConfig`] account. */
export enum DexPegOracleKind {
    Col,
    Debt,
}

export type DexPegOracleKindArgs = DexPegOracleKind;

export function getDexPegOracleKindEncoder(): Encoder<DexPegOracleKindArgs> {
    return getEnumEncoder(DexPegOracleKind);
}

export function getDexPegOracleKindDecoder(): Decoder<DexPegOracleKind> {
    return getEnumDecoder(DexPegOracleKind);
}

export function getDexPegOracleKindCodec(): Codec<DexPegOracleKindArgs, DexPegOracleKind> {
    return combineCodec(getDexPegOracleKindEncoder(), getDexPegOracleKindDecoder());
}
