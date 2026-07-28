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

export type EmptyOracle = {
    reserved: ReadonlyUint8Array;
    reserved1: ReadonlyUint8Array;
    reserved2: ReadonlyUint8Array;
    reserved3: ReadonlyUint8Array;
};

export type EmptyOracleArgs = EmptyOracle;

export function getEmptyOracleEncoder(): Encoder<EmptyOracleArgs> {
    return getStructEncoder([
        ['reserved', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved1', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved2', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved3', fixEncoderSize(getBytesEncoder(), 24)],
    ]);
}

export function getEmptyOracleDecoder(): Decoder<EmptyOracle> {
    return getStructDecoder([
        ['reserved', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved1', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved2', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved3', fixDecoderSize(getBytesDecoder(), 24)],
    ]);
}

export function getEmptyOracleCodec(): Codec<EmptyOracleArgs, EmptyOracle> {
    return combineCodec(getEmptyOracleEncoder(), getEmptyOracleDecoder());
}
