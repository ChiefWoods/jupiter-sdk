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
import { getLoanStatusDecoder, getLoanStatusEncoder, type LoanStatus, type LoanStatusArgs } from '../types/loanStatus';
import { getLoanTypeDecoder, getLoanTypeEncoder, type LoanType, type LoanTypeArgs } from '../types/loanType';

export type LoanEventV1 = {
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
    extendable: number;
    extensionCount: number;
};

export type LoanEventV1Args = {
    lender: Address;
    borrower: Address;
    creator: Address;
    offer: Address;
    status: LoanStatusArgs;
    fillIndex: number | bigint;
    principal: EventAssetArgs;
    collateral: EventAssetArgs;
    apy: number;
    duration: number;
    principalAmount: number | bigint;
    collateralAmount: number | bigint;
    interest: number | bigint;
    createdAt: number | bigint;
    expiredAt: number | bigint;
    updatedAt: number | bigint;
    bump: number;
    collateralAccountBump: number;
    loanType: LoanTypeArgs;
    extendable: number;
    extensionCount: number;
};

export function getLoanEventV1Encoder(): Encoder<LoanEventV1Args> {
    return getStructEncoder([
        ['lender', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrower', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['creator', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['offer', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['status', getLoanStatusEncoder()],
        ['fillIndex', getU64Encoder()],
        ['principal', getEventAssetEncoder()],
        ['collateral', getEventAssetEncoder()],
        ['apy', getU32Encoder()],
        ['duration', getU32Encoder()],
        ['principalAmount', getU64Encoder()],
        ['collateralAmount', getU64Encoder()],
        ['interest', getU64Encoder()],
        ['createdAt', getU64Encoder()],
        ['expiredAt', getU64Encoder()],
        ['updatedAt', getU64Encoder()],
        ['bump', getU8Encoder()],
        ['collateralAccountBump', getU8Encoder()],
        ['loanType', getLoanTypeEncoder()],
        ['extendable', getU8Encoder()],
        ['extensionCount', getU8Encoder()],
    ]);
}

export function getLoanEventV1Decoder(): Decoder<LoanEventV1> {
    return getStructDecoder([
        ['lender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrower', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['offer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['status', getLoanStatusDecoder()],
        ['fillIndex', getU64Decoder()],
        ['principal', getEventAssetDecoder()],
        ['collateral', getEventAssetDecoder()],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['principalAmount', getU64Decoder()],
        ['collateralAmount', getU64Decoder()],
        ['interest', getU64Decoder()],
        ['createdAt', getU64Decoder()],
        ['expiredAt', getU64Decoder()],
        ['updatedAt', getU64Decoder()],
        ['bump', getU8Decoder()],
        ['collateralAccountBump', getU8Decoder()],
        ['loanType', getLoanTypeDecoder()],
        ['extendable', getU8Decoder()],
        ['extensionCount', getU8Decoder()],
    ]);
}

export function getLoanEventV1Codec(): Codec<LoanEventV1Args, LoanEventV1> {
    return combineCodec(getLoanEventV1Encoder(), getLoanEventV1Decoder());
}
