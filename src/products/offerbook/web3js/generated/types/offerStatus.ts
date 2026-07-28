import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OfferStatus {
    Active,
    PartiallyFilled,
    Fulfilled,
    Cancelled,
}

export type OfferStatusArgs = OfferStatus;

export function getOfferStatusEncoder(): Encoder<OfferStatusArgs> {
    return getEnumEncoder(OfferStatus);
}

export function getOfferStatusDecoder(): Decoder<OfferStatus> {
    return getEnumDecoder(OfferStatus);
}

export function getOfferStatusCodec(): Codec<OfferStatusArgs, OfferStatus> {
    return combineCodec(getOfferStatusEncoder(), getOfferStatusDecoder());
}
