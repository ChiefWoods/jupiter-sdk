import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum PriceImpactMechanism {
    TradeSize,
    DeltaImbalance,
}

export type PriceImpactMechanismArgs = PriceImpactMechanism;

export function getPriceImpactMechanismEncoder(): Encoder<PriceImpactMechanismArgs> {
    return getEnumEncoder(PriceImpactMechanism);
}

export function getPriceImpactMechanismDecoder(): Decoder<PriceImpactMechanism> {
    return getEnumDecoder(PriceImpactMechanism);
}

export function getPriceImpactMechanismCodec(): Codec<PriceImpactMechanismArgs, PriceImpactMechanism> {
    return combineCodec(getPriceImpactMechanismEncoder(), getPriceImpactMechanismDecoder());
}
