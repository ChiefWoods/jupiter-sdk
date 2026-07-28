import {
    combineCodec,
    getI128Decoder,
    getI128Encoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** Pass the minimum i128 value to request max-withdrawal / max-payback. */
export type OperatePerfectDexAmounts = { perfectShares: bigint; token0MinMax: bigint; token1MinMax: bigint };

export type OperatePerfectDexAmountsArgs = {
    perfectShares: number | bigint;
    token0MinMax: number | bigint;
    token1MinMax: number | bigint;
};

export function getOperatePerfectDexAmountsEncoder(): Encoder<OperatePerfectDexAmountsArgs> {
    return getStructEncoder([
        ['perfectShares', getI128Encoder()],
        ['token0MinMax', getI128Encoder()],
        ['token1MinMax', getI128Encoder()],
    ]);
}

export function getOperatePerfectDexAmountsDecoder(): Decoder<OperatePerfectDexAmounts> {
    return getStructDecoder([
        ['perfectShares', getI128Decoder()],
        ['token0MinMax', getI128Decoder()],
        ['token1MinMax', getI128Decoder()],
    ]);
}

export function getOperatePerfectDexAmountsCodec(): Codec<OperatePerfectDexAmountsArgs, OperatePerfectDexAmounts> {
    return combineCodec(getOperatePerfectDexAmountsEncoder(), getOperatePerfectDexAmountsDecoder());
}
