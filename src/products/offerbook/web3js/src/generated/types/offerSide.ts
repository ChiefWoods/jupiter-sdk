import { getU8Codec } from '@solana/codecs';

export enum OfferSide {
    Principal,
    Collateral,
}

export const offerSideCodec = getU8Codec();
