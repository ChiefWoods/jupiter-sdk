import { getI128Codec, getStructCodec } from '@solana/codecs';

export interface OperateDexAmounts {
    token0: bigint;
    token1: bigint;
    sharesMinMax: bigint;
}

export const operateDexAmountsCodec = getStructCodec([
    ['token0', getI128Codec()],
    ['token1', getI128Codec()],
    ['sharesMinMax', getI128Codec()],
]);
