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

export type PeriodLimit = {
    /** Window duration in seconds (0 = disabled) */
    durationSeconds: bigint;
    /** Maximum mint amount in this window */
    maxMintAmount: bigint;
    /** Maximum redeem amount in this window */
    maxRedeemAmount: bigint;
    /** Amount minted in current window */
    mintedAmount: bigint;
    /** Amount redeemed in current window */
    redeemedAmount: bigint;
    /** Window start timestamp */
    windowStart: bigint;
};

export type PeriodLimitArgs = {
    /** Window duration in seconds (0 = disabled) */
    durationSeconds: number | bigint;
    /** Maximum mint amount in this window */
    maxMintAmount: number | bigint;
    /** Maximum redeem amount in this window */
    maxRedeemAmount: number | bigint;
    /** Amount minted in current window */
    mintedAmount: number | bigint;
    /** Amount redeemed in current window */
    redeemedAmount: number | bigint;
    /** Window start timestamp */
    windowStart: number | bigint;
};

export function getPeriodLimitEncoder(): Encoder<PeriodLimitArgs> {
    return getStructEncoder([
        ['durationSeconds', getU64Encoder()],
        ['maxMintAmount', getU64Encoder()],
        ['maxRedeemAmount', getU64Encoder()],
        ['mintedAmount', getU64Encoder()],
        ['redeemedAmount', getU64Encoder()],
        ['windowStart', getI64Encoder()],
    ]);
}

export function getPeriodLimitDecoder(): Decoder<PeriodLimit> {
    return getStructDecoder([
        ['durationSeconds', getU64Decoder()],
        ['maxMintAmount', getU64Decoder()],
        ['maxRedeemAmount', getU64Decoder()],
        ['mintedAmount', getU64Decoder()],
        ['redeemedAmount', getU64Decoder()],
        ['windowStart', getI64Decoder()],
    ]);
}

export function getPeriodLimitCodec(): Codec<PeriodLimitArgs, PeriodLimit> {
    return combineCodec(getPeriodLimitEncoder(), getPeriodLimitDecoder());
}
