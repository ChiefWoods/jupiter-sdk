import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type PricingParams = {
    tradeImpactFeeScalar: bigint;
    buffer: bigint;
    swapSpread: bigint;
    maxLeverage: bigint;
    maxGlobalLongSizes: bigint;
    maxGlobalShortSizes: bigint;
};

export type PricingParamsArgs = {
    tradeImpactFeeScalar: number | bigint;
    buffer: number | bigint;
    swapSpread: number | bigint;
    maxLeverage: number | bigint;
    maxGlobalLongSizes: number | bigint;
    maxGlobalShortSizes: number | bigint;
};

export function getPricingParamsEncoder(): Encoder<PricingParamsArgs> {
    return getStructEncoder([
        ['tradeImpactFeeScalar', getU64Encoder()],
        ['buffer', getU64Encoder()],
        ['swapSpread', getU64Encoder()],
        ['maxLeverage', getU64Encoder()],
        ['maxGlobalLongSizes', getU64Encoder()],
        ['maxGlobalShortSizes', getU64Encoder()],
    ]);
}

export function getPricingParamsDecoder(): Decoder<PricingParams> {
    return getStructDecoder([
        ['tradeImpactFeeScalar', getU64Decoder()],
        ['buffer', getU64Decoder()],
        ['swapSpread', getU64Decoder()],
        ['maxLeverage', getU64Decoder()],
        ['maxGlobalLongSizes', getU64Decoder()],
        ['maxGlobalShortSizes', getU64Decoder()],
    ]);
}

export function getPricingParamsCodec(): Codec<PricingParamsArgs, PricingParams> {
    return combineCodec(getPricingParamsEncoder(), getPricingParamsDecoder());
}
