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

export type EventProgrammableNftAsset = { mint: Address; tokenProgram: Address };

export type EventProgrammableNftAssetArgs = EventProgrammableNftAsset;

export function getEventProgrammableNftAssetEncoder(): Encoder<EventProgrammableNftAssetArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['tokenProgram', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getEventProgrammableNftAssetDecoder(): Decoder<EventProgrammableNftAsset> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getEventProgrammableNftAssetCodec(): Codec<EventProgrammableNftAssetArgs, EventProgrammableNftAsset> {
    return combineCodec(getEventProgrammableNftAssetEncoder(), getEventProgrammableNftAssetDecoder());
}
