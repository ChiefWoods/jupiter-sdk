import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getSourceTypeDecoder, getSourceTypeEncoder, type SourceType, type SourceTypeArgs } from '../types/sourceType';

export type Sources = { source: Address; invert: boolean; multiplier: bigint; divisor: bigint; sourceType: SourceType };

export type SourcesArgs = {
    source: Address;
    invert: boolean;
    multiplier: number | bigint;
    divisor: number | bigint;
    sourceType: SourceTypeArgs;
};

export function getSourcesEncoder(): Encoder<SourcesArgs> {
    return getStructEncoder([
        ['source', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['invert', getBooleanEncoder()],
        ['multiplier', getU128Encoder()],
        ['divisor', getU128Encoder()],
        ['sourceType', getSourceTypeEncoder()],
    ]);
}

export function getSourcesDecoder(): Decoder<Sources> {
    return getStructDecoder([
        ['source', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['invert', getBooleanDecoder()],
        ['multiplier', getU128Decoder()],
        ['divisor', getU128Decoder()],
        ['sourceType', getSourceTypeDecoder()],
    ]);
}

export function getSourcesCodec(): Codec<SourcesArgs, Sources> {
    return combineCodec(getSourcesEncoder(), getSourcesDecoder());
}
