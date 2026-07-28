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

export type NoFilter = { reserved: ReadonlyUint8Array };

export type NoFilterArgs = NoFilter;

export function getNoFilterEncoder(): Encoder<NoFilterArgs> {
    return getStructEncoder([['reserved', fixEncoderSize(getBytesEncoder(), 264)]]);
}

export function getNoFilterDecoder(): Decoder<NoFilter> {
    return getStructDecoder([['reserved', fixDecoderSize(getBytesDecoder(), 264)]]);
}

export function getNoFilterCodec(): Codec<NoFilterArgs, NoFilter> {
    return combineCodec(getNoFilterEncoder(), getNoFilterDecoder());
}
