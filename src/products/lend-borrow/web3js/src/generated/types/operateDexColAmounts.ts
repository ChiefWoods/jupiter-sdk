import { OperateDexAmounts, operateDexAmountsCodec } from '../types/operateDexAmounts';
import { getI128Codec, getOptionCodec, getStructCodec } from '@solana/codecs';

export interface OperateDexColAmounts {
    amounts: OperateDexAmounts | null;
    newCol: bigint | null;
}

export const operateDexColAmountsCodec = getStructCodec([
    ['amounts', getOptionCodec(operateDexAmountsCodec)],
    ['newCol', getOptionCodec(getI128Codec())],
]);
