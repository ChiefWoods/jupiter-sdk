import { getStructCodec, getU128Codec, getU8Codec } from '@solana/codecs';

export interface UserBorrowConfig {
    mode: number;
    expandPercent: bigint;
    expandDuration: bigint;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
}

export const userBorrowConfigCodec = getStructCodec([
    ['mode', getU8Codec()],
    ['expandPercent', getU128Codec()],
    ['expandDuration', getU128Codec()],
    ['baseDebtCeiling', getU128Codec()],
    ['maxDebtCeiling', getU128Codec()],
]);
