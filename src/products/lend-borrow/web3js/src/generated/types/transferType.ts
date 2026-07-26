import { getU8Codec } from '@solana/codecs';

export enum TransferType {
    SKIP,
    DIRECT,
    CLAIM,
}

export const transferTypeCodec = getU8Codec();
