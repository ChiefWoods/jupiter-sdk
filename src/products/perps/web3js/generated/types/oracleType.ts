import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OracleType {
    None,
    Test,
    Pyth,
}

export type OracleTypeArgs = OracleType;

export function getOracleTypeEncoder(): Encoder<OracleTypeArgs> {
    return getEnumEncoder(OracleType);
}

export function getOracleTypeDecoder(): Decoder<OracleType> {
    return getEnumDecoder(OracleType);
}

export function getOracleTypeCodec(): Codec<OracleTypeArgs, OracleType> {
    return combineCodec(getOracleTypeEncoder(), getOracleTypeDecoder());
}
