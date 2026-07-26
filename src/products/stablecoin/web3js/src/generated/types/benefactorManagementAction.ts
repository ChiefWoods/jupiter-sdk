import { Address } from '@solana/web3.js';
import { BenefactorStatus, benefactorStatusCodec } from '../types/benefactorStatus';
import {
    fixCodecSize,
    getBytesCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    getU16Codec,
    getU64Codec,
    getU8Codec,
    getUnitCodec,
    transformCodec,
} from '@solana/codecs';

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
    | {
          __kind: 'UpdateFeeOverride';
          index: number;
          mint: Address;
          mintFeeRate: number;
          redeemFeeRate: number;
      }
    | { __kind: 'DeleteFeeOverride'; index: number };

export const benefactorManagementActionCodec = getDiscriminatedUnionCodec([
    ['Disable', getUnitCodec()],
    ['SetStatus', getStructCodec([['status', benefactorStatusCodec]])],
    [
        'UpdateFeeRates',
        getStructCodec([
            ['mintFeeRate', getU16Codec()],
            ['redeemFeeRate', getU16Codec()],
        ]),
    ],
    [
        'UpdatePeriodLimit',
        getStructCodec([
            ['index', getU8Codec()],
            ['durationSeconds', getU64Codec()],
            ['maxMintAmount', getU64Codec()],
            ['maxRedeemAmount', getU64Codec()],
        ]),
    ],
    ['ResetPeriodLimit', getStructCodec([['index', getU8Codec()]])],
    [
        'UpdateFeeOverride',
        getStructCodec([
            ['index', getU8Codec()],
            [
                'mint',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
            ['mintFeeRate', getU16Codec()],
            ['redeemFeeRate', getU16Codec()],
        ]),
    ],
    ['DeleteFeeOverride', getStructCodec([['index', getU8Codec()]])],
]);

// Data Enum Helpers.
type GetDiscriminatedUnionVariant<
    TUnion,
    TDiscriminator extends keyof TUnion,
    TKind extends TUnion[TDiscriminator],
> = Extract<TUnion, Record<TDiscriminator, TKind>>;

type GetDiscriminatedUnionVariantContent<
    TUnion,
    TDiscriminator extends keyof TUnion,
    TKind extends TUnion[TDiscriminator],
> = Omit<GetDiscriminatedUnionVariant<TUnion, TDiscriminator, TKind>, TDiscriminator>;

export function benefactorManagementAction(
    kind: 'Disable',
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'Disable'>;
export function benefactorManagementAction(
    kind: 'SetStatus',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementAction, '__kind', 'SetStatus'>,
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'SetStatus'>;
export function benefactorManagementAction(
    kind: 'UpdateFeeRates',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementAction, '__kind', 'UpdateFeeRates'>,
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'UpdateFeeRates'>;
export function benefactorManagementAction(
    kind: 'UpdatePeriodLimit',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementAction, '__kind', 'UpdatePeriodLimit'>,
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'UpdatePeriodLimit'>;
export function benefactorManagementAction(
    kind: 'ResetPeriodLimit',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementAction, '__kind', 'ResetPeriodLimit'>,
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'ResetPeriodLimit'>;
export function benefactorManagementAction(
    kind: 'UpdateFeeOverride',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementAction, '__kind', 'UpdateFeeOverride'>,
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'UpdateFeeOverride'>;
export function benefactorManagementAction(
    kind: 'DeleteFeeOverride',
    data: GetDiscriminatedUnionVariantContent<BenefactorManagementAction, '__kind', 'DeleteFeeOverride'>,
): GetDiscriminatedUnionVariant<BenefactorManagementAction, '__kind', 'DeleteFeeOverride'>;
export function benefactorManagementAction<K extends BenefactorManagementAction['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isBenefactorManagementAction<K extends BenefactorManagementAction['__kind']>(
    kind: K,
    value: BenefactorManagementAction,
): value is BenefactorManagementAction & { __kind: K } {
    return value.__kind === kind;
}
