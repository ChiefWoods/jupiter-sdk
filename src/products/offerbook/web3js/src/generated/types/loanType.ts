import { getU8Codec } from '@solana/codecs';

export enum LoanType {
    Classic,
    Leverage,
}

export const loanTypeCodec = getU8Codec();
