import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum BisonFiPredictSide {
    Yes,
    No,
}

export type BisonFiPredictSideArgs = BisonFiPredictSide;

export function getBisonFiPredictSideEncoder(): Encoder<BisonFiPredictSideArgs> {
    return getEnumEncoder(BisonFiPredictSide);
}

export function getBisonFiPredictSideDecoder(): Decoder<BisonFiPredictSide> {
    return getEnumDecoder(BisonFiPredictSide);
}

export function getBisonFiPredictSideCodec(): Codec<BisonFiPredictSideArgs, BisonFiPredictSide> {
    return combineCodec(getBisonFiPredictSideEncoder(), getBisonFiPredictSideDecoder());
}
