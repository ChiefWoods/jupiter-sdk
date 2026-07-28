import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getAccountsTypeDecoder,
    getAccountsTypeEncoder,
    type AccountsType,
    type AccountsTypeArgs,
} from '../types/accountsType';

export type RemainingAccountsSlice = { accountsType: AccountsType; length: number };

export type RemainingAccountsSliceArgs = { accountsType: AccountsTypeArgs; length: number };

export function getRemainingAccountsSliceEncoder(): Encoder<RemainingAccountsSliceArgs> {
    return getStructEncoder([
        ['accountsType', getAccountsTypeEncoder()],
        ['length', getU8Encoder()],
    ]);
}

export function getRemainingAccountsSliceDecoder(): Decoder<RemainingAccountsSlice> {
    return getStructDecoder([
        ['accountsType', getAccountsTypeDecoder()],
        ['length', getU8Decoder()],
    ]);
}

export function getRemainingAccountsSliceCodec(): Codec<RemainingAccountsSliceArgs, RemainingAccountsSlice> {
    return combineCodec(getRemainingAccountsSliceEncoder(), getRemainingAccountsSliceDecoder());
}
