import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum BenefactorStatus {
    Active,
    Disabled,
}

export type BenefactorStatusArgs = BenefactorStatus;

export function getBenefactorStatusEncoder(): Encoder<BenefactorStatusArgs> {
    return getEnumEncoder(BenefactorStatus);
}

export function getBenefactorStatusDecoder(): Decoder<BenefactorStatus> {
    return getEnumDecoder(BenefactorStatus);
}

export function getBenefactorStatusCodec(): Codec<BenefactorStatusArgs, BenefactorStatus> {
    return combineCodec(getBenefactorStatusEncoder(), getBenefactorStatusDecoder());
}
