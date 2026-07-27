import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type Limit = { maxAumUsd: bigint; tokenWeightageBufferBps: bigint; buffer: bigint };

export type LimitArgs = {
    maxAumUsd: number | bigint;
    tokenWeightageBufferBps: number | bigint;
    buffer: number | bigint;
};

export function getLimitEncoder(): Encoder<LimitArgs> {
    return getStructEncoder([
        ['maxAumUsd', getU128Encoder()],
        ['tokenWeightageBufferBps', getU128Encoder()],
        ['buffer', getU64Encoder()],
    ]);
}

export function getLimitDecoder(): Decoder<Limit> {
    return getStructDecoder([
        ['maxAumUsd', getU128Decoder()],
        ['tokenWeightageBufferBps', getU128Decoder()],
        ['buffer', getU64Decoder()],
    ]);
}

export function getLimitCodec(): Codec<LimitArgs, Limit> {
    return combineCodec(getLimitEncoder(), getLimitDecoder());
}
