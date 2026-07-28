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

export type EventCollectionWithAttributeFilter = { collection: Address; attributes: ReadonlyUint8Array };

export type EventCollectionWithAttributeFilterArgs = EventCollectionWithAttributeFilter;

export function getEventCollectionWithAttributeFilterEncoder(): Encoder<EventCollectionWithAttributeFilterArgs> {
    return getStructEncoder([
        ['collection', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['attributes', fixEncoderSize(getBytesEncoder(), 232)],
    ]);
}

export function getEventCollectionWithAttributeFilterDecoder(): Decoder<EventCollectionWithAttributeFilter> {
    return getStructDecoder([
        ['collection', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['attributes', fixDecoderSize(getBytesDecoder(), 232)],
    ]);
}

export function getEventCollectionWithAttributeFilterCodec(): Codec<
    EventCollectionWithAttributeFilterArgs,
    EventCollectionWithAttributeFilter
> {
    return combineCodec(getEventCollectionWithAttributeFilterEncoder(), getEventCollectionWithAttributeFilterDecoder());
}
