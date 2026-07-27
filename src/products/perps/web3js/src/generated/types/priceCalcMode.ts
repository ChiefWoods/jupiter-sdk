import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum PriceCalcMode {
    Min,
    Max,
    Ignore,
}

export type PriceCalcModeArgs = PriceCalcMode;

export function getPriceCalcModeEncoder(): Encoder<PriceCalcModeArgs> {
    return getEnumEncoder(PriceCalcMode);
}

export function getPriceCalcModeDecoder(): Decoder<PriceCalcMode> {
    return getEnumDecoder(PriceCalcMode);
}

export function getPriceCalcModeCodec(): Codec<PriceCalcModeArgs, PriceCalcMode> {
    return combineCodec(getPriceCalcModeEncoder(), getPriceCalcModeDecoder());
}
