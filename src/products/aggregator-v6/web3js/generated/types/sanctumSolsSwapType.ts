import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum SanctumSolsSwapType {
    Mint,
    Claim,
    ClaimHolding,
}

export type SanctumSolsSwapTypeArgs = SanctumSolsSwapType;

export function getSanctumSolsSwapTypeEncoder(): Encoder<SanctumSolsSwapTypeArgs> {
    return getEnumEncoder(SanctumSolsSwapType);
}

export function getSanctumSolsSwapTypeDecoder(): Decoder<SanctumSolsSwapType> {
    return getEnumDecoder(SanctumSolsSwapType);
}

export function getSanctumSolsSwapTypeCodec(): Codec<SanctumSolsSwapTypeArgs, SanctumSolsSwapType> {
    return combineCodec(getSanctumSolsSwapTypeEncoder(), getSanctumSolsSwapTypeDecoder());
}
