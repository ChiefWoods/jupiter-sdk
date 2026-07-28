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

export type UserClass = { addr: Address; class: number };

export type UserClassArgs = UserClass;

export function getUserClassEncoder(): Encoder<UserClassArgs> {
    return getStructEncoder([
        ['addr', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['class', getU8Encoder()],
    ]);
}

export function getUserClassDecoder(): Decoder<UserClass> {
    return getStructDecoder([
        ['addr', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['class', getU8Decoder()],
    ]);
}

export function getUserClassCodec(): Codec<UserClassArgs, UserClass> {
    return combineCodec(getUserClassEncoder(), getUserClassDecoder());
}
