import { Address } from '@solana/web3.js';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getUnitCodec,
    transformCodec,
} from '@solana/codecs';

export type UpdateConfigAction =
    | { __kind: 'UpdateAdmin'; admin: Address }
    | { __kind: 'PauseProtocol' }
    | { __kind: 'UnpauseProtocol' }
    | { __kind: 'SetDisableRepayment'; disableRepayment: boolean }
    | { __kind: 'SetInterestFeeBps'; interestFeeBps: number }
    | { __kind: 'SetLiquidationFeeBps'; liquidationFeeBps: number }
    | { __kind: 'SetReferralRewardsFeeBps'; referralRewardsFeeBps: number }
    | { __kind: 'SetRefereeRewardsFeeBps'; refereeRewardsFeeBps: number }
    | { __kind: 'SetRepayFeeBps'; repayFeeBps: number }
    | { __kind: 'SetMinPrincipalAmount'; minPrincipalAmount: bigint }
    | { __kind: 'SetMinCollateralAmount'; minCollateralAmount: bigint }
    | { __kind: 'SetMinDuration'; minDuration: number }
    | { __kind: 'SetMinExpiry'; minExpiry: number }
    | { __kind: 'SetMaxApy'; maxApy: number }
    | { __kind: 'SetMaxDuration'; maxDuration: number }
    | { __kind: 'SetMaxExpiry'; maxExpiry: number };

export const updateConfigActionCodec = getDiscriminatedUnionCodec([
    [
        'UpdateAdmin',
        getStructCodec([
            [
                'admin',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
        ]),
    ],
    ['PauseProtocol', getUnitCodec()],
    ['UnpauseProtocol', getUnitCodec()],
    ['SetDisableRepayment', getStructCodec([['disableRepayment', getBooleanCodec()]])],
    ['SetInterestFeeBps', getStructCodec([['interestFeeBps', getU16Codec()]])],
    ['SetLiquidationFeeBps', getStructCodec([['liquidationFeeBps', getU16Codec()]])],
    ['SetReferralRewardsFeeBps', getStructCodec([['referralRewardsFeeBps', getU16Codec()]])],
    ['SetRefereeRewardsFeeBps', getStructCodec([['refereeRewardsFeeBps', getU16Codec()]])],
    ['SetRepayFeeBps', getStructCodec([['repayFeeBps', getU16Codec()]])],
    ['SetMinPrincipalAmount', getStructCodec([['minPrincipalAmount', getU64Codec()]])],
    ['SetMinCollateralAmount', getStructCodec([['minCollateralAmount', getU64Codec()]])],
    ['SetMinDuration', getStructCodec([['minDuration', getU32Codec()]])],
    ['SetMinExpiry', getStructCodec([['minExpiry', getU32Codec()]])],
    ['SetMaxApy', getStructCodec([['maxApy', getU32Codec()]])],
    ['SetMaxDuration', getStructCodec([['maxDuration', getU32Codec()]])],
    ['SetMaxExpiry', getStructCodec([['maxExpiry', getU32Codec()]])],
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

export function updateConfigAction(
    kind: 'UpdateAdmin',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'UpdateAdmin'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'UpdateAdmin'>;
export function updateConfigAction(
    kind: 'PauseProtocol',
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'PauseProtocol'>;
export function updateConfigAction(
    kind: 'UnpauseProtocol',
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'UnpauseProtocol'>;
export function updateConfigAction(
    kind: 'SetDisableRepayment',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetDisableRepayment'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetDisableRepayment'>;
export function updateConfigAction(
    kind: 'SetInterestFeeBps',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetInterestFeeBps'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetInterestFeeBps'>;
export function updateConfigAction(
    kind: 'SetLiquidationFeeBps',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetLiquidationFeeBps'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetLiquidationFeeBps'>;
export function updateConfigAction(
    kind: 'SetReferralRewardsFeeBps',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetReferralRewardsFeeBps'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetReferralRewardsFeeBps'>;
export function updateConfigAction(
    kind: 'SetRefereeRewardsFeeBps',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetRefereeRewardsFeeBps'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetRefereeRewardsFeeBps'>;
export function updateConfigAction(
    kind: 'SetRepayFeeBps',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetRepayFeeBps'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetRepayFeeBps'>;
export function updateConfigAction(
    kind: 'SetMinPrincipalAmount',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMinPrincipalAmount'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMinPrincipalAmount'>;
export function updateConfigAction(
    kind: 'SetMinCollateralAmount',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMinCollateralAmount'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMinCollateralAmount'>;
export function updateConfigAction(
    kind: 'SetMinDuration',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMinDuration'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMinDuration'>;
export function updateConfigAction(
    kind: 'SetMinExpiry',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMinExpiry'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMinExpiry'>;
export function updateConfigAction(
    kind: 'SetMaxApy',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMaxApy'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMaxApy'>;
export function updateConfigAction(
    kind: 'SetMaxDuration',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMaxDuration'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMaxDuration'>;
export function updateConfigAction(
    kind: 'SetMaxExpiry',
    data: GetDiscriminatedUnionVariantContent<UpdateConfigAction, '__kind', 'SetMaxExpiry'>,
): GetDiscriminatedUnionVariant<UpdateConfigAction, '__kind', 'SetMaxExpiry'>;
export function updateConfigAction<K extends UpdateConfigAction['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isUpdateConfigAction<K extends UpdateConfigAction['__kind']>(
    kind: K,
    value: UpdateConfigAction,
): value is UpdateConfigAction & { __kind: K } {
    return value.__kind === kind;
}
