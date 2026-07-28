import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    getUnitDecoder,
    getUnitEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
} from '@solana/codecs';
import {
    getBenefactorStatusDecoder,
    getBenefactorStatusEncoder,
    type BenefactorStatus,
    type BenefactorStatusArgs,
} from '../types/benefactorStatus';

export type BenefactorManagementAction =
    | { __kind: 'Disable' }
    | { __kind: 'SetStatus'; status: BenefactorStatus }
    | { __kind: 'UpdateFeeRates'; mintFeeRate: number; redeemFeeRate: number }
    | {
          __kind: 'UpdatePeriodLimit';
          index: number;
          durationSeconds: bigint;
          maxMintAmount: bigint;
          maxRedeemAmount: bigint;
      }
    | { __kind: 'ResetPeriodLimit'; index: number }
    | { __kind: 'UpdateFeeOverride'; index: number; mint: Address; mintFeeRate: number; redeemFeeRate: number }
    | { __kind: 'DeleteFeeOverride'; index: number };

export type BenefactorManagementActionArgs =
    | { __kind: 'Disable' }
    | { __kind: 'SetStatus'; status: BenefactorStatusArgs }
    | { __kind: 'UpdateFeeRates'; mintFeeRate: number; redeemFeeRate: number }
    | {
          __kind: 'UpdatePeriodLimit';
          index: number;
          durationSeconds: number | bigint;
          maxMintAmount: number | bigint;
          maxRedeemAmount: number | bigint;
      }
    | { __kind: 'ResetPeriodLimit'; index: number }
    | { __kind: 'UpdateFeeOverride'; index: number; mint: Address; mintFeeRate: number; redeemFeeRate: number }
    | { __kind: 'DeleteFeeOverride'; index: number };

export function getBenefactorManagementActionEncoder(): Encoder<BenefactorManagementActionArgs> {
    return getDiscriminatedUnionEncoder([
        ['Disable', getUnitEncoder()],
        ['SetStatus', getStructEncoder([['status', getBenefactorStatusEncoder()]])],
        [
            'UpdateFeeRates',
            getStructEncoder([
                ['mintFeeRate', getU16Encoder()],
                ['redeemFeeRate', getU16Encoder()],
            ]),
        ],
        [
            'UpdatePeriodLimit',
            getStructEncoder([
                ['index', getU8Encoder()],
                ['durationSeconds', getU64Encoder()],
                ['maxMintAmount', getU64Encoder()],
                ['maxRedeemAmount', getU64Encoder()],
            ]),
        ],
        ['ResetPeriodLimit', getStructEncoder([['index', getU8Encoder()]])],
        [
            'UpdateFeeOverride',
            getStructEncoder([
                ['index', getU8Encoder()],
                ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
                ['mintFeeRate', getU16Encoder()],
                ['redeemFeeRate', getU16Encoder()],
            ]),
        ],
        ['DeleteFeeOverride', getStructEncoder([['index', getU8Encoder()]])],
    ]);
}

export function getBenefactorManagementActionDecoder(): Decoder<BenefactorManagementAction> {
    return getDiscriminatedUnionDecoder([
        ['Disable', getUnitDecoder()],
        ['SetStatus', getStructDecoder([['status', getBenefactorStatusDecoder()]])],
        [
            'UpdateFeeRates',
            getStructDecoder([
                ['mintFeeRate', getU16Decoder()],
                ['redeemFeeRate', getU16Decoder()],
            ]),
        ],
        [
            'UpdatePeriodLimit',
            getStructDecoder([
                ['index', getU8Decoder()],
                ['durationSeconds', getU64Decoder()],
                ['maxMintAmount', getU64Decoder()],
                ['maxRedeemAmount', getU64Decoder()],
            ]),
        ],
        ['ResetPeriodLimit', getStructDecoder([['index', getU8Decoder()]])],
        [
            'UpdateFeeOverride',
            getStructDecoder([
                ['index', getU8Decoder()],
                ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
                ['mintFeeRate', getU16Decoder()],
                ['redeemFeeRate', getU16Decoder()],
            ]),
        ],
        ['DeleteFeeOverride', getStructDecoder([['index', getU8Decoder()]])],
    ]);
}

export function getBenefactorManagementActionCodec(): Codec<
    BenefactorManagementActionArgs,
    BenefactorManagementAction
> {
    return combineCodec(getBenefactorManagementActionEncoder(), getBenefactorManagementActionDecoder());
}

// Data Enum Helpers.
export function benefactorManagementAction(
    kind: 'Disable',
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'Disable'>;
export function benefactorManagementAction(
    kind: 'SetStatus',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementActionArgs, '__kind', 'SetStatus'>,
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'SetStatus'>;
export function benefactorManagementAction(
    kind: 'UpdateFeeRates',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementActionArgs, '__kind', 'UpdateFeeRates'>,
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'UpdateFeeRates'>;
export function benefactorManagementAction(
    kind: 'UpdatePeriodLimit',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementActionArgs, '__kind', 'UpdatePeriodLimit'>,
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'UpdatePeriodLimit'>;
export function benefactorManagementAction(
    kind: 'ResetPeriodLimit',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementActionArgs, '__kind', 'ResetPeriodLimit'>,
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'ResetPeriodLimit'>;
export function benefactorManagementAction(
    kind: 'UpdateFeeOverride',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementActionArgs, '__kind', 'UpdateFeeOverride'>,
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'UpdateFeeOverride'>;
export function benefactorManagementAction(
    kind: 'DeleteFeeOverride',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementActionArgs, '__kind', 'DeleteFeeOverride'>,
): GetDiscriminatedUnionVariant<BenefactorManagementActionArgs, '__kind', 'DeleteFeeOverride'>;
export function benefactorManagementAction<K extends BenefactorManagementActionArgs['__kind'], Data>(
    kind: K,
    data?: Data,
) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isBenefactorManagementAction<K extends BenefactorManagementAction['__kind']>(
    kind: K,
    value: BenefactorManagementAction,
): value is BenefactorManagementAction & { __kind: K } {
    return value.__kind === kind;
}
