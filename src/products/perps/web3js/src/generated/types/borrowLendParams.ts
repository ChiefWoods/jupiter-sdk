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

export type BorrowLendParams = {
    borrowsLimitInBps: bigint;
    maintainanceMarginBps: bigint;
    protocolFeeBps: bigint;
    liquidationMargin: bigint;
    liquidationFeeBps: bigint;
};

export type BorrowLendParamsArgs = {
    borrowsLimitInBps: number | bigint;
    maintainanceMarginBps: number | bigint;
    protocolFeeBps: number | bigint;
    liquidationMargin: number | bigint;
    liquidationFeeBps: number | bigint;
};

export function getBorrowLendParamsEncoder(): Encoder<BorrowLendParamsArgs> {
    return getStructEncoder([
        ['borrowsLimitInBps', getU64Encoder()],
        ['maintainanceMarginBps', getU64Encoder()],
        ['protocolFeeBps', getU64Encoder()],
        ['liquidationMargin', getU64Encoder()],
        ['liquidationFeeBps', getU64Encoder()],
    ]);
}

export function getBorrowLendParamsDecoder(): Decoder<BorrowLendParams> {
    return getStructDecoder([
        ['borrowsLimitInBps', getU64Decoder()],
        ['maintainanceMarginBps', getU64Decoder()],
        ['protocolFeeBps', getU64Decoder()],
        ['liquidationMargin', getU64Decoder()],
        ['liquidationFeeBps', getU64Decoder()],
    ]);
}

export function getBorrowLendParamsCodec(): Codec<BorrowLendParamsArgs, BorrowLendParams> {
    return combineCodec(getBorrowLendParamsEncoder(), getBorrowLendParamsDecoder());
}
