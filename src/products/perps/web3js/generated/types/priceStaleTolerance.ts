import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum PriceStaleTolerance {
    Strict,
    Loose,
}

export type PriceStaleToleranceArgs = PriceStaleTolerance;

export function getPriceStaleToleranceEncoder(): Encoder<PriceStaleToleranceArgs> {
    return getEnumEncoder(PriceStaleTolerance);
}

export function getPriceStaleToleranceDecoder(): Decoder<PriceStaleTolerance> {
    return getEnumDecoder(PriceStaleTolerance);
}

export function getPriceStaleToleranceCodec(): Codec<PriceStaleToleranceArgs, PriceStaleTolerance> {
    return combineCodec(getPriceStaleToleranceEncoder(), getPriceStaleToleranceDecoder());
}
