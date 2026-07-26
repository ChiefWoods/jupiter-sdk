import { getU8Codec } from '@solana/codecs';

export enum BenefactorStatus {
    Active,
    Disabled,
}

export const benefactorStatusCodec = getU8Codec();
