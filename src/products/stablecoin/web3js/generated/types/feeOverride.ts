import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type FeeOverride = { mint: Address; mintFeeRate: number; redeemFeeRate: number; padding: ReadonlyUint8Array };

export type FeeOverrideArgs = FeeOverride;

export function getFeeOverrideEncoder(): Encoder<FeeOverrideArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['mintFeeRate', getU16Encoder()],
        ['redeemFeeRate', getU16Encoder()],
        ['padding', fixEncoderSize(getBytesEncoder(), 4)],
    ]);
}

export function getFeeOverrideDecoder(): Decoder<FeeOverride> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mintFeeRate', getU16Decoder()],
        ['redeemFeeRate', getU16Decoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 4)],
    ]);
}

export function getFeeOverrideCodec(): Codec<FeeOverrideArgs, FeeOverride> {
    return combineCodec(getFeeOverrideEncoder(), getFeeOverrideDecoder());
}
