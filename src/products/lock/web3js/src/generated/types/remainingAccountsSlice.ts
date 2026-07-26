import { AccountsType, accountsTypeCodec } from '../types/accountsType';
import { getStructCodec, getU8Codec } from '@solana/codecs';

export interface RemainingAccountsSlice {
    accountsType: AccountsType;
    length: number;
}

export const remainingAccountsSliceCodec = getStructCodec([
    ['accountsType', accountsTypeCodec],
    ['length', getU8Codec()],
]);
