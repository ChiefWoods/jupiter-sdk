import {
    combineCodec,
    getI32Decoder,
    getI32Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type OraclePrice = { price: bigint; exponent: number };

export type OraclePriceArgs = { price: number | bigint; exponent: number };

export function getOraclePriceEncoder(): Encoder<OraclePriceArgs> {
    return getStructEncoder([
        ['price', getU64Encoder()],
        ['exponent', getI32Encoder()],
    ]);
}

export function getOraclePriceDecoder(): Decoder<OraclePrice> {
    return getStructDecoder([
        ['price', getU64Decoder()],
        ['exponent', getI32Decoder()],
    ]);
}

export function getOraclePriceCodec(): Codec<OraclePriceArgs, OraclePrice> {
    return combineCodec(getOraclePriceEncoder(), getOraclePriceDecoder());
}
