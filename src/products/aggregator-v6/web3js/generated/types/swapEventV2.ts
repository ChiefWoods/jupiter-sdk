import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type SwapEventV2 = {
    inputMint: Address;
    inputAmount: bigint;
    outputMint: Address;
    outputAmount: bigint;
    amm: Address;
};

export type SwapEventV2Args = {
    inputMint: Address;
    inputAmount: number | bigint;
    outputMint: Address;
    outputAmount: number | bigint;
    amm: Address;
};

export function getSwapEventV2Encoder(): Encoder<SwapEventV2Args> {
    return getStructEncoder([
        ['inputMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['inputAmount', getU64Encoder()],
        ['outputMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['outputAmount', getU64Encoder()],
        ['amm', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function getSwapEventV2Decoder(): Decoder<SwapEventV2> {
    return getStructDecoder([
        ['inputMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['inputAmount', getU64Decoder()],
        ['outputMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['outputAmount', getU64Decoder()],
        ['amm', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function getSwapEventV2Codec(): Codec<SwapEventV2Args, SwapEventV2> {
    return combineCodec(getSwapEventV2Encoder(), getSwapEventV2Decoder());
}
