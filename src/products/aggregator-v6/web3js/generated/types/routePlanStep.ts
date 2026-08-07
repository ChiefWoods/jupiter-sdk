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
import { getSwapTypeDecoder, getSwapTypeEncoder, type SwapType, type SwapTypeArgs } from '../types/swapType';

export type RoutePlanStep = { swap: SwapType; percent: number; inputIndex: number; outputIndex: number };

export type RoutePlanStepArgs = { swap: SwapTypeArgs; percent: number; inputIndex: number; outputIndex: number };

export function getRoutePlanStepEncoder(): Encoder<RoutePlanStepArgs> {
    return getStructEncoder([
        ['swap', getSwapTypeEncoder()],
        ['percent', getU8Encoder()],
        ['inputIndex', getU8Encoder()],
        ['outputIndex', getU8Encoder()],
    ]);
}

export function getRoutePlanStepDecoder(): Decoder<RoutePlanStep> {
    return getStructDecoder([
        ['swap', getSwapTypeDecoder()],
        ['percent', getU8Decoder()],
        ['inputIndex', getU8Decoder()],
        ['outputIndex', getU8Decoder()],
    ]);
}

export function getRoutePlanStepCodec(): Codec<RoutePlanStepArgs, RoutePlanStep> {
    return combineCodec(getRoutePlanStepEncoder(), getRoutePlanStepDecoder());
}
