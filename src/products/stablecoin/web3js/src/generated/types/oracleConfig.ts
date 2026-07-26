import { Address } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    getTupleCodec,
    getUnitCodec,
    transformCodec,
} from '@solana/codecs';

export type OracleConfig =
    | { __kind: 'None' }
    | { __kind: 'Pyth'; fields: [Uint8Array, Address] }
    | { __kind: 'SwitchboardOnDemand'; fields: [Address] }
    | { __kind: 'Doves'; fields: [Address] };

export const oracleConfigCodec = getDiscriminatedUnionCodec([
    ['None', getUnitCodec()],
    [
        'Pyth',
        getStructCodec([
            [
                'fields',
                getTupleCodec([
                    fixCodecSize(getBytesCodec(), 32),
                    transformCodec(
                        fixCodecSize(getBytesCodec(), 32),
                        (value: Address) => value.toBytes(),
                        value => new Address(value),
                    ),
                ]),
            ],
        ]),
    ],
    [
        'SwitchboardOnDemand',
        getStructCodec([
            [
                'fields',
                getTupleCodec([
                    transformCodec(
                        fixCodecSize(getBytesCodec(), 32),
                        (value: Address) => value.toBytes(),
                        value => new Address(value),
                    ),
                ]),
            ],
        ]),
    ],
    [
        'Doves',
        getStructCodec([
            [
                'fields',
                getTupleCodec([
                    transformCodec(
                        fixCodecSize(getBytesCodec(), 32),
                        (value: Address) => value.toBytes(),
                        value => new Address(value),
                    ),
                ]),
            ],
        ]),
    ],
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

export function oracleConfig(kind: 'None'): GetDiscriminatedUnionVariant<OracleConfig, '__kind', 'None'>;
export function oracleConfig(
    kind: 'Pyth',
    data: GetDiscriminatedUnionVariantContent<OracleConfig, '__kind', 'Pyth'>['fields'],
): GetDiscriminatedUnionVariant<OracleConfig, '__kind', 'Pyth'>;
export function oracleConfig(
    kind: 'SwitchboardOnDemand',
    data: GetDiscriminatedUnionVariantContent<OracleConfig, '__kind', 'SwitchboardOnDemand'>['fields'],
): GetDiscriminatedUnionVariant<OracleConfig, '__kind', 'SwitchboardOnDemand'>;
export function oracleConfig(
    kind: 'Doves',
    data: GetDiscriminatedUnionVariantContent<OracleConfig, '__kind', 'Doves'>['fields'],
): GetDiscriminatedUnionVariant<OracleConfig, '__kind', 'Doves'>;
export function oracleConfig<K extends OracleConfig['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isOracleConfig<K extends OracleConfig['__kind']>(
    kind: K,
    value: OracleConfig,
): value is OracleConfig & { __kind: K } {
    return value.__kind === kind;
}
