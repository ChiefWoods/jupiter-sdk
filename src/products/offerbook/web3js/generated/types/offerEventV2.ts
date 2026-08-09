import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getEventAssetDecoder, getEventAssetEncoder, type EventAsset, type EventAssetArgs } from '../types/eventAsset';
import {
    getEventAssetFilterDecoder,
    getEventAssetFilterEncoder,
    type EventAssetFilter,
    type EventAssetFilterArgs,
} from '../types/eventAssetFilter';
import { getOfferSideDecoder, getOfferSideEncoder, type OfferSide, type OfferSideArgs } from '../types/offerSide';
import {
    getOfferStatusDecoder,
    getOfferStatusEncoder,
    type OfferStatus,
    type OfferStatusArgs,
} from '../types/offerStatus';

export type OfferEventV2 = {
    creator: Address;
    side: OfferSide;
    status: OfferStatus;
    principal: EventAsset;
    collateral: EventAsset;
    filter: EventAssetFilter;
    principalAmount: bigint;
    remainingPrincipal: bigint;
    collateralAmount: bigint;
    remainingCollateral: bigint;
    apy: number;
    duration: number;
    createdAt: bigint;
    expiredAt: bigint;
    updatedAt: bigint;
    minFillAmount: bigint;
    fillCounter: bigint;
    allowPartialFill: number;
    bump: number;
    counteredOffer: Address;
    allowExtend: number;
};

export type OfferEventV2Args = {
    creator: Address;
    side: OfferSideArgs;
    status: OfferStatusArgs;
    principal: EventAssetArgs;
    collateral: EventAssetArgs;
    filter: EventAssetFilterArgs;
    principalAmount: number | bigint;
    remainingPrincipal: number | bigint;
    collateralAmount: number | bigint;
    remainingCollateral: number | bigint;
    apy: number;
    duration: number;
    createdAt: number | bigint;
    expiredAt: number | bigint;
    updatedAt: number | bigint;
    minFillAmount: number | bigint;
    fillCounter: number | bigint;
    allowPartialFill: number;
    bump: number;
    counteredOffer: Address;
    allowExtend: number;
};

export function getOfferEventV2Encoder(): Encoder<OfferEventV2Args> {
    return getStructEncoder([
        ['creator', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['side', getOfferSideEncoder()],
        ['status', getOfferStatusEncoder()],
        ['principal', getEventAssetEncoder()],
        ['collateral', getEventAssetEncoder()],
        ['filter', getEventAssetFilterEncoder()],
        ['principalAmount', getU64Encoder()],
        ['remainingPrincipal', getU64Encoder()],
        ['collateralAmount', getU64Encoder()],
        ['remainingCollateral', getU64Encoder()],
        ['apy', getU32Encoder()],
        ['duration', getU32Encoder()],
        ['createdAt', getU64Encoder()],
        ['expiredAt', getU64Encoder()],
        ['updatedAt', getU64Encoder()],
        ['minFillAmount', getU64Encoder()],
        ['fillCounter', getU64Encoder()],
        ['allowPartialFill', getU8Encoder()],
        ['bump', getU8Encoder()],
        [
            'counteredOffer',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
        ['allowExtend', getU8Encoder()],
    ]);
}

export function getOfferEventV2Decoder(): Decoder<OfferEventV2> {
    return getStructDecoder([
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['side', getOfferSideDecoder()],
        ['status', getOfferStatusDecoder()],
        ['principal', getEventAssetDecoder()],
        ['collateral', getEventAssetDecoder()],
        ['filter', getEventAssetFilterDecoder()],
        ['principalAmount', getU64Decoder()],
        ['remainingPrincipal', getU64Decoder()],
        ['collateralAmount', getU64Decoder()],
        ['remainingCollateral', getU64Decoder()],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['createdAt', getU64Decoder()],
        ['expiredAt', getU64Decoder()],
        ['updatedAt', getU64Decoder()],
        ['minFillAmount', getU64Decoder()],
        ['fillCounter', getU64Decoder()],
        ['allowPartialFill', getU8Decoder()],
        ['bump', getU8Decoder()],
        ['counteredOffer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['allowExtend', getU8Decoder()],
    ]);
}

export function getOfferEventV2Codec(): Codec<OfferEventV2Args, OfferEventV2> {
    return combineCodec(getOfferEventV2Encoder(), getOfferEventV2Decoder());
}
