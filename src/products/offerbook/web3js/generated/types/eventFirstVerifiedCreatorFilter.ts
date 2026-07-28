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

export type EventFirstVerifiedCreatorFilter = { creator: Address };

export type EventFirstVerifiedCreatorFilterArgs = EventFirstVerifiedCreatorFilter;

export function getEventFirstVerifiedCreatorFilterEncoder(): Encoder<EventFirstVerifiedCreatorFilterArgs> {
    return getStructEncoder([
        ['creator', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getEventFirstVerifiedCreatorFilterDecoder(): Decoder<EventFirstVerifiedCreatorFilter> {
    return getStructDecoder([
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getEventFirstVerifiedCreatorFilterCodec(): Codec<
    EventFirstVerifiedCreatorFilterArgs,
    EventFirstVerifiedCreatorFilter
> {
    return combineCodec(getEventFirstVerifiedCreatorFilterEncoder(), getEventFirstVerifiedCreatorFilterDecoder());
}
