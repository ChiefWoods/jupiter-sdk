import { RemainingAccountsSlice, remainingAccountsSliceCodec } from '../types/remainingAccountsSlice';
import { getArrayCodec, getStructCodec } from '@solana/codecs';

export interface RemainingAccountsInfo {
    slices: Array<RemainingAccountsSlice>;
}

export const remainingAccountsInfoCodec = getStructCodec([['slices', getArrayCodec(remainingAccountsSliceCodec)]]);
