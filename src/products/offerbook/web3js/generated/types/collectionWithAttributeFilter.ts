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

export type CollectionWithAttributeFilter = { collection: Address; attributes: ReadonlyUint8Array };

export type CollectionWithAttributeFilterArgs = CollectionWithAttributeFilter;

export function getCollectionWithAttributeFilterEncoder(): Encoder<CollectionWithAttributeFilterArgs> {
    return getStructEncoder([
        ['collection', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['attributes', fixEncoderSize(getBytesEncoder(), 232)],
    ]);
}

export function getCollectionWithAttributeFilterDecoder(): Decoder<CollectionWithAttributeFilter> {
    return getStructDecoder([
        ['collection', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['attributes', fixDecoderSize(getBytesDecoder(), 232)],
    ]);
}

export function getCollectionWithAttributeFilterCodec(): Codec<
    CollectionWithAttributeFilterArgs,
    CollectionWithAttributeFilter
> {
    return combineCodec(getCollectionWithAttributeFilterEncoder(), getCollectionWithAttributeFilterDecoder());
}
