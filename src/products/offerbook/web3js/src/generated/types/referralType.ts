import { getU8Codec } from '@solana/codecs';

export enum ReferralType {
    Lender,
    Borrower,
}

export const referralTypeCodec = getU8Codec();
