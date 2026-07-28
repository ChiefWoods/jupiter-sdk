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

export type PythV2Oracle = {
    feedId: ReadonlyUint8Array;
    account: Address;
    reserved1: ReadonlyUint8Array;
    reserved2: ReadonlyUint8Array;
};

export type PythV2OracleArgs = PythV2Oracle;

export function getPythV2OracleEncoder(): Encoder<PythV2OracleArgs> {
    return getStructEncoder([
        ['feedId', fixEncoderSize(getBytesEncoder(), 32)],
        ['account', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved1', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved2', fixEncoderSize(getBytesEncoder(), 24)],
    ]);
}

export function getPythV2OracleDecoder(): Decoder<PythV2Oracle> {
    return getStructDecoder([
        ['feedId', fixDecoderSize(getBytesDecoder(), 32)],
        ['account', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved1', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved2', fixDecoderSize(getBytesDecoder(), 24)],
    ]);
}

export function getPythV2OracleCodec(): Codec<PythV2OracleArgs, PythV2Oracle> {
    return combineCodec(getPythV2OracleEncoder(), getPythV2OracleDecoder());
}
