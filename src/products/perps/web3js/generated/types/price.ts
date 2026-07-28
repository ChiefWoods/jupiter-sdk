import {
    combineCodec,
    getI32Decoder,
    getI32Encoder,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type Price = { price: bigint; expo: number; publishTime: bigint };

export type PriceArgs = { price: number | bigint; expo: number; publishTime: number | bigint };

export function getPriceEncoder(): Encoder<PriceArgs> {
    return getStructEncoder([
        ['price', getU64Encoder()],
        ['expo', getI32Encoder()],
        ['publishTime', getI64Encoder()],
    ]);
}

export function getPriceDecoder(): Decoder<Price> {
    return getStructDecoder([
        ['price', getU64Decoder()],
        ['expo', getI32Decoder()],
        ['publishTime', getI64Decoder()],
    ]);
}

export function getPriceCodec(): Codec<PriceArgs, Price> {
    return combineCodec(getPriceEncoder(), getPriceDecoder());
}
