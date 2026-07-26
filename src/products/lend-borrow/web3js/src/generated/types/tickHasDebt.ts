import { fixCodecSize, getBytesCodec, getStructCodec } from '@solana/codecs';

export interface TickHasDebt {
    childrenBits: Uint8Array;
}

export const tickHasDebtCodec = getStructCodec([['childrenBits', fixCodecSize(getBytesCodec(), 32)]]);
