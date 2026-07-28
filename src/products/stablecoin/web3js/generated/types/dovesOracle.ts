import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type DovesOracle = {
    account: Address;
    reserved1: ReadonlyUint8Array;
    reserved2: ReadonlyUint8Array;
    reserved3: ReadonlyUint8Array;
};

export type DovesOracleArgs = DovesOracle;

export function getDovesOracleEncoder(): Encoder<DovesOracleArgs> {
    return getStructEncoder([
        ['account', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved1', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved2', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved3', fixEncoderSize(getBytesEncoder(), 24)],
    ]);
}

export function getDovesOracleDecoder(): Decoder<DovesOracle> {
    return getStructDecoder([
        ['account', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved1', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved2', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved3', fixDecoderSize(getBytesDecoder(), 24)],
    ]);
}

export function getDovesOracleCodec(): Codec<DovesOracleArgs, DovesOracle> {
    return combineCodec(getDovesOracleEncoder(), getDovesOracleDecoder());
}
