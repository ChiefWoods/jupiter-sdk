import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface LiquidateDexDebtAmounts {
    token0: bigint;
    token1: bigint;
    sharesMin: bigint;
}

export const liquidateDexDebtAmountsCodec = getStructCodec([
    ['token0', getU64Codec()],
    ['token1', getU64Codec()],
    ['sharesMin', getU64Codec()],
]);
