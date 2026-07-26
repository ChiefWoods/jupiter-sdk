import { Address } from '@solana/web3.js';
import { EventAsset, eventAssetCodec } from '../types/eventAsset';
import { LoanStatus, loanStatusCodec } from '../types/loanStatus';
import { LoanType, loanTypeCodec } from '../types/loanType';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface LoanEventV0 {
    lender: Address;
    borrower: Address;
    creator: Address;
    offer: Address;
    status: LoanStatus;
    fillIndex: bigint;
    principal: EventAsset;
    collateral: EventAsset;
    apy: number;
    duration: number;
    principalAmount: bigint;
    collateralAmount: bigint;
    interest: bigint;
    createdAt: bigint;
    expiredAt: bigint;
    updatedAt: bigint;
    bump: number;
    collateralAccountBump: number;
    loanType: LoanType;
}

export const loanEventV0Codec = getStructCodec([
    [
        'lender',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'borrower',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'offer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['status', loanStatusCodec],
    ['fillIndex', getU64Codec()],
    ['principal', eventAssetCodec],
    ['collateral', eventAssetCodec],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['principalAmount', getU64Codec()],
    ['collateralAmount', getU64Codec()],
    ['interest', getU64Codec()],
    ['createdAt', getU64Codec()],
    ['expiredAt', getU64Codec()],
    ['updatedAt', getU64Codec()],
    ['bump', getU8Codec()],
    ['collateralAccountBump', getU8Codec()],
    ['loanType', loanTypeCodec],
]);
