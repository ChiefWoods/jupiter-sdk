import {
    combineCodec,
    getArrayDecoder,
    getArrayEncoder,
    getF32Decoder,
    getF32Encoder,
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

export type PriceImpactBuffer = {
    openInterest: Array<bigint>;
    lastUpdated: bigint;
    feeFactor: bigint;
    exponent: number;
    deltaImbalanceThresholdDecimal: bigint;
    maxFeeBps: bigint;
};

export type PriceImpactBufferArgs = {
    openInterest: Array<number | bigint>;
    lastUpdated: number | bigint;
    feeFactor: number | bigint;
    exponent: number;
    deltaImbalanceThresholdDecimal: number | bigint;
    maxFeeBps: number | bigint;
};

export function getPriceImpactBufferEncoder(): Encoder<PriceImpactBufferArgs> {
    return getStructEncoder([
        ['openInterest', getArrayEncoder(getI64Encoder(), { size: 60 })],
        ['lastUpdated', getI64Encoder()],
        ['feeFactor', getU64Encoder()],
        ['exponent', getF32Encoder()],
        ['deltaImbalanceThresholdDecimal', getU64Encoder()],
        ['maxFeeBps', getU64Encoder()],
    ]);
}

export function getPriceImpactBufferDecoder(): Decoder<PriceImpactBuffer> {
    return getStructDecoder([
        ['openInterest', getArrayDecoder(getI64Decoder(), { size: 60 })],
        ['lastUpdated', getI64Decoder()],
        ['feeFactor', getU64Decoder()],
        ['exponent', getF32Decoder()],
        ['deltaImbalanceThresholdDecimal', getU64Decoder()],
        ['maxFeeBps', getU64Decoder()],
    ]);
}

export function getPriceImpactBufferCodec(): Codec<PriceImpactBufferArgs, PriceImpactBuffer> {
    return combineCodec(getPriceImpactBufferEncoder(), getPriceImpactBufferDecoder());
}
