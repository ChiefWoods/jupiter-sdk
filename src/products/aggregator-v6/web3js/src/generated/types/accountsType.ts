import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum AccountsType {
    TransferHookA,
    TransferHookB,
    TransferHookReward,
    TransferHookInput,
    TransferHookIntermediate,
    TransferHookOutput,
    SupplementalTickArrays,
    SupplementalTickArraysOne,
    SupplementalTickArraysTwo,
}

export type AccountsTypeArgs = AccountsType;

export function getAccountsTypeEncoder(): Encoder<AccountsTypeArgs> {
    return getEnumEncoder(AccountsType);
}

export function getAccountsTypeDecoder(): Decoder<AccountsType> {
    return getEnumDecoder(AccountsType);
}

export function getAccountsTypeCodec(): Codec<AccountsTypeArgs, AccountsType> {
    return combineCodec(getAccountsTypeEncoder(), getAccountsTypeDecoder());
}
