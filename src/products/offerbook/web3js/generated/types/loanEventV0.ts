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

/**
 * Frozen pre-extension loan event schema. Kept in the IDL so historical events
 * remain parseable; not emitted by current code (see `LoanEventV1`).
 */
export type LoanEventV0 = {
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
};

export type LoanEventV0Args = {
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
};

export function getLoanEventV0Encoder(): Encoder<LoanEventV0Args> {
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
    ]);
}

export function getLoanEventV0Decoder(): Decoder<LoanEventV0> {
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
    ]);
}

export function getLoanEventV0Codec(): Codec<LoanEventV0Args, LoanEventV0> {
    return combineCodec(getLoanEventV0Encoder(), getLoanEventV0Decoder());
}
