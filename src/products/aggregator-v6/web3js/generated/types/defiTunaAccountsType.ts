import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum DefiTunaAccountsType {
    TransferHookA,
    TransferHookB,
    TransferHookInput,
    TransferHookIntermediate,
    TransferHookOutput,
    SupplementalTickArrays,
    SupplementalTickArraysOne,
    SupplementalTickArraysTwo,
}

export type DefiTunaAccountsTypeArgs = DefiTunaAccountsType;

export function getDefiTunaAccountsTypeEncoder(): Encoder<DefiTunaAccountsTypeArgs> {
    return getEnumEncoder(DefiTunaAccountsType);
}

export function getDefiTunaAccountsTypeDecoder(): Decoder<DefiTunaAccountsType> {
    return getEnumDecoder(DefiTunaAccountsType);
}

export function getDefiTunaAccountsTypeCodec(): Codec<DefiTunaAccountsTypeArgs, DefiTunaAccountsType> {
    return combineCodec(getDefiTunaAccountsTypeEncoder(), getDefiTunaAccountsTypeDecoder());
}
