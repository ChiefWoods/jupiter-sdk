import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getSwapDecoder, getSwapEncoder, type Swap, type SwapArgs } from '../types/swap';

export type RoutePlanStep = { swap: Swap; percent: number; inputIndex: number; outputIndex: number };

export type RoutePlanStepArgs = { swap: SwapArgs; percent: number; inputIndex: number; outputIndex: number };

export function getRoutePlanStepEncoder(): Encoder<RoutePlanStepArgs> {
    return getStructEncoder([
        ['swap', getSwapEncoder()],
        ['percent', getU8Encoder()],
        ['inputIndex', getU8Encoder()],
        ['outputIndex', getU8Encoder()],
    ]);
}

export function getRoutePlanStepDecoder(): Decoder<RoutePlanStep> {
    return getStructDecoder([
        ['swap', getSwapDecoder()],
        ['percent', getU8Decoder()],
        ['inputIndex', getU8Decoder()],
        ['outputIndex', getU8Decoder()],
    ]);
}

export function getRoutePlanStepCodec(): Codec<RoutePlanStepArgs, RoutePlanStep> {
    return combineCodec(getRoutePlanStepEncoder(), getRoutePlanStepDecoder());
}
