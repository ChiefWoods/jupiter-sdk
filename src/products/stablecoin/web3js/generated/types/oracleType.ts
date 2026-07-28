import {
    combineCodec,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getStructDecoder,
    getStructEncoder,
    getTupleDecoder,
    getTupleEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
} from '@solana/codecs';
import {
    getDovesOracleDecoder,
    getDovesOracleEncoder,
    type DovesOracle,
    type DovesOracleArgs,
} from '../types/dovesOracle';
import {
    getEmptyOracleDecoder,
    getEmptyOracleEncoder,
    type EmptyOracle,
    type EmptyOracleArgs,
} from '../types/emptyOracle';
import {
    getPythV2OracleDecoder,
    getPythV2OracleEncoder,
    type PythV2Oracle,
    type PythV2OracleArgs,
} from '../types/pythV2Oracle';
import {
    getSwitchboardOnDemandOracleDecoder,
    getSwitchboardOnDemandOracleEncoder,
    type SwitchboardOnDemandOracle,
    type SwitchboardOnDemandOracleArgs,
} from '../types/switchboardOnDemandOracle';

export type OracleType =
    | { __kind: 'Empty'; fields: readonly [EmptyOracle] }
    | { __kind: 'Pyth'; fields: readonly [PythV2Oracle] }
    | { __kind: 'Doves'; fields: readonly [DovesOracle] }
    | { __kind: 'SwitchboardOnDemand'; fields: readonly [SwitchboardOnDemandOracle] };

export type OracleTypeArgs =
    | { __kind: 'Empty'; fields: readonly [EmptyOracleArgs] }
    | { __kind: 'Pyth'; fields: readonly [PythV2OracleArgs] }
    | { __kind: 'Doves'; fields: readonly [DovesOracleArgs] }
    | { __kind: 'SwitchboardOnDemand'; fields: readonly [SwitchboardOnDemandOracleArgs] };

export function getOracleTypeEncoder(): Encoder<OracleTypeArgs> {
    return getDiscriminatedUnionEncoder([
        ['Empty', getStructEncoder([['fields', getTupleEncoder([getEmptyOracleEncoder()])]])],
        ['Pyth', getStructEncoder([['fields', getTupleEncoder([getPythV2OracleEncoder()])]])],
        ['Doves', getStructEncoder([['fields', getTupleEncoder([getDovesOracleEncoder()])]])],
        [
            'SwitchboardOnDemand',
            getStructEncoder([['fields', getTupleEncoder([getSwitchboardOnDemandOracleEncoder()])]]),
        ],
    ]);
}

export function getOracleTypeDecoder(): Decoder<OracleType> {
    return getDiscriminatedUnionDecoder([
        ['Empty', getStructDecoder([['fields', getTupleDecoder([getEmptyOracleDecoder()])]])],
        ['Pyth', getStructDecoder([['fields', getTupleDecoder([getPythV2OracleDecoder()])]])],
        ['Doves', getStructDecoder([['fields', getTupleDecoder([getDovesOracleDecoder()])]])],
        [
            'SwitchboardOnDemand',
            getStructDecoder([['fields', getTupleDecoder([getSwitchboardOnDemandOracleDecoder()])]]),
        ],
    ]);
}

export function getOracleTypeCodec(): Codec<OracleTypeArgs, OracleType> {
    return combineCodec(getOracleTypeEncoder(), getOracleTypeDecoder());
}

// Data Enum Helpers.
export function oracleType(
    kind: 'Empty',
    data: GetDiscriminatedUnionVariantContent<OracleTypeArgs, '__kind', 'Empty'>['fields'],
): GetDiscriminatedUnionVariant<OracleTypeArgs, '__kind', 'Empty'>;
export function oracleType(
    kind: 'Pyth',
    data: GetDiscriminatedUnionVariantContent<OracleTypeArgs, '__kind', 'Pyth'>['fields'],
): GetDiscriminatedUnionVariant<OracleTypeArgs, '__kind', 'Pyth'>;
export function oracleType(
    kind: 'Doves',
    data: GetDiscriminatedUnionVariantContent<OracleTypeArgs, '__kind', 'Doves'>['fields'],
): GetDiscriminatedUnionVariant<OracleTypeArgs, '__kind', 'Doves'>;
export function oracleType(
    kind: 'SwitchboardOnDemand',
    data: GetDiscriminatedUnionVariantContent<OracleTypeArgs, '__kind', 'SwitchboardOnDemand'>['fields'],
): GetDiscriminatedUnionVariant<OracleTypeArgs, '__kind', 'SwitchboardOnDemand'>;
export function oracleType<K extends OracleTypeArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isOracleType<K extends OracleType['__kind']>(
    kind: K,
    value: OracleType,
): value is OracleType & { __kind: K } {
    return value.__kind === kind;
}
