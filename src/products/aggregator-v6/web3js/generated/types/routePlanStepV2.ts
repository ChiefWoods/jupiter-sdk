import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU8Decoder,
    getU8Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getSwapTypeDecoder, getSwapTypeEncoder, type SwapType, type SwapTypeArgs } from '../types/swapType';

export type RoutePlanStepV2 = { swap: SwapType; bps: number; inputIndex: number; outputIndex: number };

export type RoutePlanStepV2Args = { swap: SwapTypeArgs; bps: number; inputIndex: number; outputIndex: number };

export function getRoutePlanStepV2Encoder(): Encoder<RoutePlanStepV2Args> {
    return getStructEncoder([
        ['swap', getSwapTypeEncoder()],
        ['bps', getU16Encoder()],
        ['inputIndex', getU8Encoder()],
        ['outputIndex', getU8Encoder()],
    ]);
}

export function getRoutePlanStepV2Decoder(): Decoder<RoutePlanStepV2> {
    return getStructDecoder([
        ['swap', getSwapTypeDecoder()],
        ['bps', getU16Decoder()],
        ['inputIndex', getU8Decoder()],
        ['outputIndex', getU8Decoder()],
    ]);
}

export function getRoutePlanStepV2Codec(): Codec<RoutePlanStepV2Args, RoutePlanStepV2> {
    return combineCodec(getRoutePlanStepV2Encoder(), getRoutePlanStepV2Decoder());
}
