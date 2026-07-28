import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum TransferType {
    SKIP,
    DIRECT,
    CLAIM,
}

export type TransferTypeArgs = TransferType;

export function getTransferTypeEncoder(): Encoder<TransferTypeArgs> {
    return getEnumEncoder(TransferType);
}

export function getTransferTypeDecoder(): Decoder<TransferType> {
    return getEnumDecoder(TransferType);
}

export function getTransferTypeCodec(): Codec<TransferTypeArgs, TransferType> {
    return combineCodec(getTransferTypeEncoder(), getTransferTypeDecoder());
}
