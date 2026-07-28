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

export type CoreNftAsset = { asset: Address; reserved: ReadonlyUint8Array };

export type CoreNftAssetArgs = CoreNftAsset;

export function getCoreNftAssetEncoder(): Encoder<CoreNftAssetArgs> {
    return getStructEncoder([
        ['asset', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved', fixEncoderSize(getBytesEncoder(), 232)],
    ]);
}

export function getCoreNftAssetDecoder(): Decoder<CoreNftAsset> {
    return getStructDecoder([
        ['asset', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 232)],
    ]);
}

export function getCoreNftAssetCodec(): Codec<CoreNftAssetArgs, CoreNftAsset> {
    return combineCodec(getCoreNftAssetEncoder(), getCoreNftAssetDecoder());
}
