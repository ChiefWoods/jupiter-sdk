import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type AddressU8 = { addr: Address; value: number };

export type AddressU8Args = AddressU8;

export function getAddressU8Encoder(): Encoder<AddressU8Args> {
    return getStructEncoder([
        ['addr', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['value', getU8Encoder()],
    ]);
}

export function getAddressU8Decoder(): Decoder<AddressU8> {
    return getStructDecoder([
        ['addr', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['value', getU8Decoder()],
    ]);
}

export function getAddressU8Codec(): Codec<AddressU8Args, AddressU8> {
    return combineCodec(getAddressU8Encoder(), getAddressU8Decoder());
}
