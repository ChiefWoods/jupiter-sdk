import { fixCodecSize, getBytesCodec, getStructCodec } from '@solana/codecs';

export interface NoFilter {
    reserved: Uint8Array;
}

export const noFilterCodec = getStructCodec([['reserved', fixCodecSize(getBytesCodec(), 264)]]);
