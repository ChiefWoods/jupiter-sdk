import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface LiquidatePerfectDexDebtAmounts {
    token0PerUnitShares: bigint;
    token1PerUnitShares: bigint;
}

export const liquidatePerfectDexDebtAmountsCodec = getStructCodec([
    ['token0PerUnitShares', getU64Codec()],
    ['token1PerUnitShares', getU64Codec()],
]);
