import { Address } from '@solana/web3.js';
import { EventAsset, eventAssetCodec } from '../types/eventAsset';
import { EventAssetFilter, eventAssetFilterCodec } from '../types/eventAssetFilter';
import { OfferSide, offerSideCodec } from '../types/offerSide';
import { OfferStatus, offerStatusCodec } from '../types/offerStatus';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface OfferEventV1 {
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
}

export const offerEventV1Codec = getStructCodec([
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['side', offerSideCodec],
    ['status', offerStatusCodec],
    ['principal', eventAssetCodec],
    ['collateral', eventAssetCodec],
    ['filter', eventAssetFilterCodec],
    ['principalAmount', getU64Codec()],
    ['remainingPrincipal', getU64Codec()],
    ['collateralAmount', getU64Codec()],
    ['remainingCollateral', getU64Codec()],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['createdAt', getU64Codec()],
    ['expiredAt', getU64Codec()],
    ['updatedAt', getU64Codec()],
    ['minFillAmount', getU64Codec()],
    ['fillCounter', getU64Codec()],
    ['allowPartialFill', getU8Codec()],
    ['bump', getU8Codec()],
    [
        'counteredOffer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);
