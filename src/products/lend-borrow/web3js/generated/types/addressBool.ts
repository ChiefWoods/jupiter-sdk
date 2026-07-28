import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type AddressBool = { addr: Address; value: boolean };

export type AddressBoolArgs = AddressBool;

export function getAddressBoolEncoder(): Encoder<AddressBoolArgs> {
    return getStructEncoder([
        ['addr', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['value', getBooleanEncoder()],
    ]);
}

export function getAddressBoolDecoder(): Decoder<AddressBool> {
    return getStructDecoder([
        ['addr', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['value', getBooleanDecoder()],
    ]);
}

export function getAddressBoolCodec(): Codec<AddressBoolArgs, AddressBool> {
    return combineCodec(getAddressBoolEncoder(), getAddressBoolDecoder());
}
