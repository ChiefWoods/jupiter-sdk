import { OperatePerfectDexAmounts, operatePerfectDexAmountsCodec } from '../types/operatePerfectDexAmounts';
import { getI128Codec, getOptionCodec, getStructCodec } from '@solana/codecs';

export interface OperatePerfectDexColAmounts {
    amounts: OperatePerfectDexAmounts | null;
    newCol: bigint | null;
}

export const operatePerfectDexColAmountsCodec = getStructCodec([
    ['amounts', getOptionCodec(operatePerfectDexAmountsCodec)],
    ['newCol', getOptionCodec(getI128Codec())],
]);
