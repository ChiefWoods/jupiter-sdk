import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum HyloSwapType {
    MintStable,
    RedeemStable,
    MintLever,
    RedeemLever,
    SwapStableToLever,
    SwapLeverToStable,
    StabilityPoolDeposit,
    StabilityPoolWithdraw,
}

export type HyloSwapTypeArgs = HyloSwapType;

export function getHyloSwapTypeEncoder(): Encoder<HyloSwapTypeArgs> {
    return getEnumEncoder(HyloSwapType);
}

export function getHyloSwapTypeDecoder(): Decoder<HyloSwapType> {
    return getEnumDecoder(HyloSwapType);
}

export function getHyloSwapTypeCodec(): Codec<HyloSwapTypeArgs, HyloSwapType> {
    return combineCodec(getHyloSwapTypeEncoder(), getHyloSwapTypeDecoder());
}
