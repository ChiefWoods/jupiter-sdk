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

export type Fees = {
    swapMultiplier: bigint;
    stableSwapMultiplier: bigint;
    addRemoveLiquidityBps: bigint;
    swapBps: bigint;
    taxBps: bigint;
    stableSwapBps: bigint;
    stableSwapTaxBps: bigint;
    liquidationRewardBps: bigint;
    protocolShareBps: bigint;
};

export type FeesArgs = {
    swapMultiplier: number | bigint;
    stableSwapMultiplier: number | bigint;
    addRemoveLiquidityBps: number | bigint;
    swapBps: number | bigint;
    taxBps: number | bigint;
    stableSwapBps: number | bigint;
    stableSwapTaxBps: number | bigint;
    liquidationRewardBps: number | bigint;
    protocolShareBps: number | bigint;
};

export function getFeesEncoder(): Encoder<FeesArgs> {
    return getStructEncoder([
        ['swapMultiplier', getU64Encoder()],
        ['stableSwapMultiplier', getU64Encoder()],
        ['addRemoveLiquidityBps', getU64Encoder()],
        ['swapBps', getU64Encoder()],
        ['taxBps', getU64Encoder()],
        ['stableSwapBps', getU64Encoder()],
        ['stableSwapTaxBps', getU64Encoder()],
        ['liquidationRewardBps', getU64Encoder()],
        ['protocolShareBps', getU64Encoder()],
    ]);
}

export function getFeesDecoder(): Decoder<Fees> {
    return getStructDecoder([
        ['swapMultiplier', getU64Decoder()],
        ['stableSwapMultiplier', getU64Decoder()],
        ['addRemoveLiquidityBps', getU64Decoder()],
        ['swapBps', getU64Decoder()],
        ['taxBps', getU64Decoder()],
        ['stableSwapBps', getU64Decoder()],
        ['stableSwapTaxBps', getU64Decoder()],
        ['liquidationRewardBps', getU64Decoder()],
        ['protocolShareBps', getU64Decoder()],
    ]);
}

export function getFeesCodec(): Codec<FeesArgs, Fees> {
    return combineCodec(getFeesEncoder(), getFeesDecoder());
}
