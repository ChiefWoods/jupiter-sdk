import {
    combineCodec,
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

export type PoolApr = { lastUpdated: bigint; feeAprBps: bigint; realizedFeeUsd: bigint };

export type PoolAprArgs = { lastUpdated: number | bigint; feeAprBps: number | bigint; realizedFeeUsd: number | bigint };

export function getPoolAprEncoder(): Encoder<PoolAprArgs> {
    return getStructEncoder([
        ['lastUpdated', getI64Encoder()],
        ['feeAprBps', getU64Encoder()],
        ['realizedFeeUsd', getU64Encoder()],
    ]);
}

export function getPoolAprDecoder(): Decoder<PoolApr> {
    return getStructDecoder([
        ['lastUpdated', getI64Decoder()],
        ['feeAprBps', getU64Decoder()],
        ['realizedFeeUsd', getU64Decoder()],
    ]);
}

export function getPoolAprCodec(): Codec<PoolAprArgs, PoolApr> {
    return combineCodec(getPoolAprEncoder(), getPoolAprDecoder());
}
