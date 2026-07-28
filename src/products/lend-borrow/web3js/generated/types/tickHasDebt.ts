import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

/**
 * Tick has debt structure
 * Each TickHasDebt can track 8 * 256 = 2048 ticks
 * children_bits has 32 bytes = 256 bits total
 * Each map within the array covers 256 ticks
 */
export type TickHasDebt = { childrenBits: ReadonlyUint8Array };

export type TickHasDebtArgs = TickHasDebt;

export function getTickHasDebtEncoder(): Encoder<TickHasDebtArgs> {
    return getStructEncoder([['childrenBits', fixEncoderSize(getBytesEncoder(), 32)]]);
}

export function getTickHasDebtDecoder(): Decoder<TickHasDebt> {
    return getStructDecoder([['childrenBits', fixDecoderSize(getBytesDecoder(), 32)]]);
}

export function getTickHasDebtCodec(): Codec<TickHasDebtArgs, TickHasDebt> {
    return combineCodec(getTickHasDebtEncoder(), getTickHasDebtDecoder());
}
