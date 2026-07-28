import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum LoanStatus {
    Active,
    Repaid,
    Defaulted,
}

export type LoanStatusArgs = LoanStatus;

export function getLoanStatusEncoder(): Encoder<LoanStatusArgs> {
    return getEnumEncoder(LoanStatus);
}

export function getLoanStatusDecoder(): Decoder<LoanStatus> {
    return getEnumDecoder(LoanStatus);
}

export function getLoanStatusCodec(): Codec<LoanStatusArgs, LoanStatus> {
    return combineCodec(getLoanStatusEncoder(), getLoanStatusDecoder());
}
