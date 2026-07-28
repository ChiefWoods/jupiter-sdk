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
import { getSwapDecoder, getSwapEncoder, type Swap, type SwapArgs } from '../types/swap';

export type RoutePlanStepV2 = { swap: Swap; bps: number; inputIndex: number; outputIndex: number };

export type RoutePlanStepV2Args = { swap: SwapArgs; bps: number; inputIndex: number; outputIndex: number };

export function getRoutePlanStepV2Encoder(): Encoder<RoutePlanStepV2Args> {
    return getStructEncoder([
        ['swap', getSwapEncoder()],
        ['bps', getU16Encoder()],
        ['inputIndex', getU8Encoder()],
        ['outputIndex', getU8Encoder()],
    ]);
}

export function getRoutePlanStepV2Decoder(): Decoder<RoutePlanStepV2> {
    return getStructDecoder([
        ['swap', getSwapDecoder()],
        ['bps', getU16Decoder()],
        ['inputIndex', getU8Decoder()],
        ['outputIndex', getU8Decoder()],
    ]);
}

export function getRoutePlanStepV2Codec(): Codec<RoutePlanStepV2Args, RoutePlanStepV2> {
    return combineCodec(getRoutePlanStepV2Encoder(), getRoutePlanStepV2Decoder());
}
