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

export type JumpRateState = {
    minRateBps: bigint;
    maxRateBps: bigint;
    targetRateBps: bigint;
    targetUtilizationRate: bigint;
};

export type JumpRateStateArgs = {
    minRateBps: number | bigint;
    maxRateBps: number | bigint;
    targetRateBps: number | bigint;
    targetUtilizationRate: number | bigint;
};

export function getJumpRateStateEncoder(): Encoder<JumpRateStateArgs> {
    return getStructEncoder([
        ['minRateBps', getU64Encoder()],
        ['maxRateBps', getU64Encoder()],
        ['targetRateBps', getU64Encoder()],
        ['targetUtilizationRate', getU64Encoder()],
    ]);
}

export function getJumpRateStateDecoder(): Decoder<JumpRateState> {
    return getStructDecoder([
        ['minRateBps', getU64Decoder()],
        ['maxRateBps', getU64Decoder()],
        ['targetRateBps', getU64Decoder()],
        ['targetUtilizationRate', getU64Decoder()],
    ]);
}

export function getJumpRateStateCodec(): Codec<JumpRateStateArgs, JumpRateState> {
    return combineCodec(getJumpRateStateEncoder(), getJumpRateStateDecoder());
}
