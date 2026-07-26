import { getU8Codec } from '@solana/codecs';

export enum LoanStatus {
    Active,
    Repaid,
    Defaulted,
}

export const loanStatusCodec = getU8Codec();
