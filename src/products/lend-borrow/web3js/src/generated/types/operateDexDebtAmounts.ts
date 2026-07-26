import { OperateDexAmounts, operateDexAmountsCodec } from '../types/operateDexAmounts';
import { getI128Codec, getOptionCodec, getStructCodec } from '@solana/codecs';

export interface OperateDexDebtAmounts {
    amounts: OperateDexAmounts | null;
    newDebt: bigint | null;
}

export const operateDexDebtAmountsCodec = getStructCodec([
    ['amounts', getOptionCodec(operateDexAmountsCodec)],
    ['newDebt', getOptionCodec(getI128Codec())],
]);
