import { getU8Codec } from '@solana/codecs';

export enum OrderStatus {
    Pending,
    Filled,
    Failed,
    PartiallyFilled,
    Cancelled,
}

export const orderStatusCodec = getU8Codec();
