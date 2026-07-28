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

export type FirstVerifiedCreatorFilter = { creator: Address; reserved: ReadonlyUint8Array };

export type FirstVerifiedCreatorFilterArgs = FirstVerifiedCreatorFilter;

export function getFirstVerifiedCreatorFilterEncoder(): Encoder<FirstVerifiedCreatorFilterArgs> {
    return getStructEncoder([
        ['creator', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved', fixEncoderSize(getBytesEncoder(), 232)],
    ]);
}

export function getFirstVerifiedCreatorFilterDecoder(): Decoder<FirstVerifiedCreatorFilter> {
    return getStructDecoder([
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 232)],
    ]);
}

export function getFirstVerifiedCreatorFilterCodec(): Codec<
    FirstVerifiedCreatorFilterArgs,
    FirstVerifiedCreatorFilter
> {
    return combineCodec(getFirstVerifiedCreatorFilterEncoder(), getFirstVerifiedCreatorFilterDecoder());
}
