import {
    getBooleanCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
    getUnitCodec,
} from '@solana/codecs';

export type ConfigManagementAction =
    | { __kind: 'Pause' }
    | { __kind: 'UpdatePauseFlag'; isMintRedeemEnabled: boolean }
    | {
          __kind: 'UpdatePeriodLimit';
          index: number;
          durationSeconds: bigint;
          maxMintAmount: bigint;
          maxRedeemAmount: bigint;
      }
    | { __kind: 'ResetPeriodLimit'; index: number }
    | { __kind: 'SetPegPriceUSD'; pegPriceUsd: bigint };

export const configManagementActionCodec = getDiscriminatedUnionCodec([
    ['Pause', getUnitCodec()],
    ['UpdatePauseFlag', getStructCodec([['isMintRedeemEnabled', getBooleanCodec()]])],
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
    ['SetPegPriceUSD', getStructCodec([['pegPriceUsd', getU64Codec()]])],
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

export function configManagementAction(
    kind: 'Pause',
): GetDiscriminatedUnionVariant<ConfigManagementAction, '__kind', 'Pause'>;
export function configManagementAction(
    kind: 'UpdatePauseFlag',
    data: GetDiscriminatedUnionVariantContent<ConfigManagementAction, '__kind', 'UpdatePauseFlag'>,
): GetDiscriminatedUnionVariant<ConfigManagementAction, '__kind', 'UpdatePauseFlag'>;
export function configManagementAction(
    kind: 'UpdatePeriodLimit',
    data: GetDiscriminatedUnionVariantContent<ConfigManagementAction, '__kind', 'UpdatePeriodLimit'>,
): GetDiscriminatedUnionVariant<ConfigManagementAction, '__kind', 'UpdatePeriodLimit'>;
export function configManagementAction(
    kind: 'ResetPeriodLimit',
    data: GetDiscriminatedUnionVariantContent<ConfigManagementAction, '__kind', 'ResetPeriodLimit'>,
): GetDiscriminatedUnionVariant<ConfigManagementAction, '__kind', 'ResetPeriodLimit'>;
export function configManagementAction(
    kind: 'SetPegPriceUSD',
    data: GetDiscriminatedUnionVariantContent<ConfigManagementAction, '__kind', 'SetPegPriceUSD'>,
): GetDiscriminatedUnionVariant<ConfigManagementAction, '__kind', 'SetPegPriceUSD'>;
export function configManagementAction<K extends ConfigManagementAction['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isConfigManagementAction<K extends ConfigManagementAction['__kind']>(
    kind: K,
    value: ConfigManagementAction,
): value is ConfigManagementAction & { __kind: K } {
    return value.__kind === kind;
}
