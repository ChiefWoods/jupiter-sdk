import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum LoanType {
    Classic,
    Leverage,
}

export type LoanTypeArgs = LoanType;

export function getLoanTypeEncoder(): Encoder<LoanTypeArgs> {
    return getEnumEncoder(LoanType);
}

export function getLoanTypeDecoder(): Decoder<LoanType> {
    return getEnumDecoder(LoanType);
}

export function getLoanTypeCodec(): Codec<LoanTypeArgs, LoanType> {
    return combineCodec(getLoanTypeEncoder(), getLoanTypeDecoder());
}
