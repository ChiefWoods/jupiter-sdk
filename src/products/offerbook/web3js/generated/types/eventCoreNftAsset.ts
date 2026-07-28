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

export type EventCoreNftAsset = { asset: Address };

export type EventCoreNftAssetArgs = EventCoreNftAsset;

export function getEventCoreNftAssetEncoder(): Encoder<EventCoreNftAssetArgs> {
    return getStructEncoder([
        ['asset', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getEventCoreNftAssetDecoder(): Decoder<EventCoreNftAsset> {
    return getStructDecoder([
        ['asset', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getEventCoreNftAssetCodec(): Codec<EventCoreNftAssetArgs, EventCoreNftAsset> {
    return combineCodec(getEventCoreNftAssetEncoder(), getEventCoreNftAssetDecoder());
}
