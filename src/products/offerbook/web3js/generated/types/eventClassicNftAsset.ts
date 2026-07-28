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

export type EventClassicNftAsset = { mint: Address; tokenProgram: Address };

export type EventClassicNftAssetArgs = EventClassicNftAsset;

export function getEventClassicNftAssetEncoder(): Encoder<EventClassicNftAssetArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['tokenProgram', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getEventClassicNftAssetDecoder(): Decoder<EventClassicNftAsset> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getEventClassicNftAssetCodec(): Codec<EventClassicNftAssetArgs, EventClassicNftAsset> {
    return combineCodec(getEventClassicNftAssetEncoder(), getEventClassicNftAssetDecoder());
}
