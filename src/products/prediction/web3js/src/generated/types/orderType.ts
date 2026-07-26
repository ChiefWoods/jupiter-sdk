import { getU8Codec } from '@solana/codecs';

export enum OrderType {
    Market,
    Limit,
}

export const orderTypeCodec = getU8Codec();
