import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OfferSide {
    Principal,
    Collateral,
}

export type OfferSideArgs = OfferSide;

export function getOfferSideEncoder(): Encoder<OfferSideArgs> {
    return getEnumEncoder(OfferSide);
}

export function getOfferSideDecoder(): Decoder<OfferSide> {
    return getEnumDecoder(OfferSide);
}

export function getOfferSideCodec(): Codec<OfferSideArgs, OfferSide> {
    return combineCodec(getOfferSideEncoder(), getOfferSideDecoder());
}
