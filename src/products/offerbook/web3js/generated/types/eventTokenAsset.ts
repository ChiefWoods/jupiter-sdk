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

export type EventTokenAsset = { mint: Address; tokenProgram: Address };

export type EventTokenAssetArgs = EventTokenAsset;

export function getEventTokenAssetEncoder(): Encoder<EventTokenAssetArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['tokenProgram', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getEventTokenAssetDecoder(): Decoder<EventTokenAsset> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getEventTokenAssetCodec(): Codec<EventTokenAssetArgs, EventTokenAsset> {
    return combineCodec(getEventTokenAssetEncoder(), getEventTokenAssetDecoder());
}
