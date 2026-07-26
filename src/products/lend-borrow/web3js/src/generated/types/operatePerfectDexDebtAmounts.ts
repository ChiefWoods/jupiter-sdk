import { OperatePerfectDexAmounts, operatePerfectDexAmountsCodec } from '../types/operatePerfectDexAmounts';
import { getI128Codec, getOptionCodec, getStructCodec } from '@solana/codecs';

export interface OperatePerfectDexDebtAmounts {
    amounts: OperatePerfectDexAmounts | null;
    newDebt: bigint | null;
}

export const operatePerfectDexDebtAmountsCodec = getStructCodec([
    ['amounts', getOptionCodec(operatePerfectDexAmountsCodec)],
    ['newDebt', getOptionCodec(getI128Codec())],
]);
