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
} from '@solana/codecs';

export type EventCollectionFilter = { collection: Address };

export type EventCollectionFilterArgs = EventCollectionFilter;

export function getEventCollectionFilterEncoder(): Encoder<EventCollectionFilterArgs> {
    return getStructEncoder([
        ['collection', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getEventCollectionFilterDecoder(): Decoder<EventCollectionFilter> {
    return getStructDecoder([
        ['collection', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getEventCollectionFilterCodec(): Codec<EventCollectionFilterArgs, EventCollectionFilter> {
    return combineCodec(getEventCollectionFilterEncoder(), getEventCollectionFilterDecoder());
}
