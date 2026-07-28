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

export type CollectionFilter = { collection: Address; reserved: ReadonlyUint8Array };

export type CollectionFilterArgs = CollectionFilter;

export function getCollectionFilterEncoder(): Encoder<CollectionFilterArgs> {
    return getStructEncoder([
        ['collection', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved', fixEncoderSize(getBytesEncoder(), 232)],
    ]);
}

export function getCollectionFilterDecoder(): Decoder<CollectionFilter> {
    return getStructDecoder([
        ['collection', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 232)],
    ]);
}

export function getCollectionFilterCodec(): Codec<CollectionFilterArgs, CollectionFilter> {
    return combineCodec(getCollectionFilterEncoder(), getCollectionFilterDecoder());
}
