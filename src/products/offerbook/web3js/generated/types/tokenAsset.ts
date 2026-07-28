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

export type TokenAsset = { mint: Address; tokenProgram: Address; reserved: ReadonlyUint8Array };

export type TokenAssetArgs = TokenAsset;

export function getTokenAssetEncoder(): Encoder<TokenAssetArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['tokenProgram', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved', fixEncoderSize(getBytesEncoder(), 200)],
    ]);
}

export function getTokenAssetDecoder(): Decoder<TokenAsset> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 200)],
    ]);
}

export function getTokenAssetCodec(): Codec<TokenAssetArgs, TokenAsset> {
    return combineCodec(getTokenAssetEncoder(), getTokenAssetDecoder());
}
