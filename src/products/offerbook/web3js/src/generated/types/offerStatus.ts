import { getU8Codec } from '@solana/codecs';

export enum OfferStatus {
    Active,
    PartiallyFilled,
    Fulfilled,
    Cancelled,
}

export const offerStatusCodec = getU8Codec();
