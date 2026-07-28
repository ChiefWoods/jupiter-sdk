import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum ReferralType {
    Lender,
    Borrower,
}

export type ReferralTypeArgs = ReferralType;

export function getReferralTypeEncoder(): Encoder<ReferralTypeArgs> {
    return getEnumEncoder(ReferralType);
}

export function getReferralTypeDecoder(): Decoder<ReferralType> {
    return getEnumDecoder(ReferralType);
}

export function getReferralTypeCodec(): Codec<ReferralTypeArgs, ReferralType> {
    return combineCodec(getReferralTypeEncoder(), getReferralTypeDecoder());
}
