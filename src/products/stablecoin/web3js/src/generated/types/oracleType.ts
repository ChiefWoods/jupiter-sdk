import { DovesOracle, dovesOracleCodec } from '../types/dovesOracle';
import { EmptyOracle, emptyOracleCodec } from '../types/emptyOracle';
import { PythV2Oracle, pythV2OracleCodec } from '../types/pythV2Oracle';
import { SwitchboardOnDemandOracle, switchboardOnDemandOracleCodec } from '../types/switchboardOnDemandOracle';
import { getDiscriminatedUnionCodec, getStructCodec, getTupleCodec } from '@solana/codecs';

export type OracleType =
    | { __kind: 'Empty'; fields: [EmptyOracle] }
    | { __kind: 'Pyth'; fields: [PythV2Oracle] }
    | { __kind: 'Doves'; fields: [DovesOracle] }
    | { __kind: 'SwitchboardOnDemand'; fields: [SwitchboardOnDemandOracle] };

export const oracleTypeCodec = getDiscriminatedUnionCodec([
    ['Empty', getStructCodec([['fields', getTupleCodec([emptyOracleCodec])]])],
    ['Pyth', getStructCodec([['fields', getTupleCodec([pythV2OracleCodec])]])],
    ['Doves', getStructCodec([['fields', getTupleCodec([dovesOracleCodec])]])],
    ['SwitchboardOnDemand', getStructCodec([['fields', getTupleCodec([switchboardOnDemandOracleCodec])]])],
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

export function oracleType(
    kind: 'Empty',
    data: GetDiscriminatedUnionVariantContent<OracleType, '__kind', 'Empty'>['fields'],
): GetDiscriminatedUnionVariant<OracleType, '__kind', 'Empty'>;
export function oracleType(
    kind: 'Pyth',
    data: GetDiscriminatedUnionVariantContent<OracleType, '__kind', 'Pyth'>['fields'],
): GetDiscriminatedUnionVariant<OracleType, '__kind', 'Pyth'>;
export function oracleType(
    kind: 'Doves',
    data: GetDiscriminatedUnionVariantContent<OracleType, '__kind', 'Doves'>['fields'],
): GetDiscriminatedUnionVariant<OracleType, '__kind', 'Doves'>;
export function oracleType(
    kind: 'SwitchboardOnDemand',
    data: GetDiscriminatedUnionVariantContent<OracleType, '__kind', 'SwitchboardOnDemand'>['fields'],
): GetDiscriminatedUnionVariant<OracleType, '__kind', 'SwitchboardOnDemand'>;
export function oracleType<K extends OracleType['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isOracleType<K extends OracleType['__kind']>(
    kind: K,
    value: OracleType,
): value is OracleType & { __kind: K } {
    return value.__kind === kind;
}
