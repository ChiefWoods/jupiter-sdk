import { Address } from '@solana/web3.js';
import { OracleConfig, oracleConfigCodec } from '../types/oracleConfig';
import { VaultStatus, vaultStatusCodec } from '../types/vaultStatus';
import {
    fixCodecSize,
    getBytesCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
    getUnitCodec,
    transformCodec,
} from '@solana/codecs';

export type VaultManagementAction =
    | { __kind: 'Disable' }
    | { __kind: 'SetStatus'; status: VaultStatus }
    | { __kind: 'UpdateOracle'; index: number; oracle: OracleConfig }
    | {
          __kind: 'UpdatePeriodLimit';
          index: number;
          durationSeconds: bigint;
          maxMintAmount: bigint;
          maxRedeemAmount: bigint;
      }
    | { __kind: 'ResetPeriodLimit'; index: number }
    | { __kind: 'SetCustodian'; newCustodian: Address }
    | { __kind: 'SetStalesnessThreshold'; stalesnessThreshold: bigint }
    | { __kind: 'SetMinOraclePrice'; minOraclePriceUsd: bigint }
    | { __kind: 'SetMaxOraclePrice'; maxOraclePriceUsd: bigint };

export const vaultManagementActionCodec = getDiscriminatedUnionCodec([
    ['Disable', getUnitCodec()],
    ['SetStatus', getStructCodec([['status', vaultStatusCodec]])],
    [
        'UpdateOracle',
        getStructCodec([
            ['index', getU8Codec()],
            ['oracle', oracleConfigCodec],
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
        'SetCustodian',
        getStructCodec([
            [
                'newCustodian',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
        ]),
    ],
    ['SetStalesnessThreshold', getStructCodec([['stalesnessThreshold', getU64Codec()]])],
    ['SetMinOraclePrice', getStructCodec([['minOraclePriceUsd', getU64Codec()]])],
    ['SetMaxOraclePrice', getStructCodec([['maxOraclePriceUsd', getU64Codec()]])],
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

export function vaultManagementAction(
    kind: 'Disable',
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'Disable'>;
export function vaultManagementAction(
    kind: 'SetStatus',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'SetStatus'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'SetStatus'>;
export function vaultManagementAction(
    kind: 'UpdateOracle',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'UpdateOracle'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'UpdateOracle'>;
export function vaultManagementAction(
    kind: 'UpdatePeriodLimit',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'UpdatePeriodLimit'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'UpdatePeriodLimit'>;
export function vaultManagementAction(
    kind: 'ResetPeriodLimit',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'ResetPeriodLimit'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'ResetPeriodLimit'>;
export function vaultManagementAction(
    kind: 'SetCustodian',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'SetCustodian'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'SetCustodian'>;
export function vaultManagementAction(
    kind: 'SetStalesnessThreshold',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'SetStalesnessThreshold'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'SetStalesnessThreshold'>;
export function vaultManagementAction(
    kind: 'SetMinOraclePrice',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'SetMinOraclePrice'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'SetMinOraclePrice'>;
export function vaultManagementAction(
    kind: 'SetMaxOraclePrice',
    data: GetDiscriminatedUnionVariantContent<VaultManagementAction, '__kind', 'SetMaxOraclePrice'>,
): GetDiscriminatedUnionVariant<VaultManagementAction, '__kind', 'SetMaxOraclePrice'>;
export function vaultManagementAction<K extends VaultManagementAction['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isVaultManagementAction<K extends VaultManagementAction['__kind']>(
    kind: K,
    value: VaultManagementAction,
): value is VaultManagementAction & { __kind: K } {
    return value.__kind === kind;
}
