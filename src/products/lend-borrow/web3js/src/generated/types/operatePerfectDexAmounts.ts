import { getI128Codec, getStructCodec } from '@solana/codecs';

export interface OperatePerfectDexAmounts {
    perfectShares: bigint;
    token0MinMax: bigint;
    token1MinMax: bigint;
}

export const operatePerfectDexAmountsCodec = getStructCodec([
    ['perfectShares', getI128Codec()],
    ['token0MinMax', getI128Codec()],
    ['token1MinMax', getI128Codec()],
]);
