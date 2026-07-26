import { getI64Codec, getStructCodec, getU64Codec } from '@solana/codecs';

export interface PeriodLimit {
    durationSeconds: bigint;
    maxMintAmount: bigint;
    maxRedeemAmount: bigint;
    mintedAmount: bigint;
    redeemedAmount: bigint;
    windowStart: bigint;
}

export const periodLimitCodec = getStructCodec([
    ['durationSeconds', getU64Codec()],
    ['maxMintAmount', getU64Codec()],
    ['maxRedeemAmount', getU64Codec()],
    ['mintedAmount', getU64Codec()],
    ['redeemedAmount', getU64Codec()],
    ['windowStart', getI64Codec()],
]);
