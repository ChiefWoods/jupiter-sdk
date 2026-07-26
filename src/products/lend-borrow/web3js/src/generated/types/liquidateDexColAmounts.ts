import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface LiquidateDexColAmounts {
    token0PerUnitShares: bigint;
    token1PerUnitShares: bigint;
}

export const liquidateDexColAmountsCodec = getStructCodec([
    ['token0PerUnitShares', getU64Codec()],
    ['token1PerUnitShares', getU64Codec()],
]);
