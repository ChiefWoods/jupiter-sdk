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
    getTupleDecoder,
    getTupleEncoder,
    getUnitDecoder,
    getUnitEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type OracleConfig =
    | { __kind: 'None' }
    | { __kind: 'Pyth'; fields: readonly [ReadonlyUint8Array, Address] }
    | { __kind: 'SwitchboardOnDemand'; fields: readonly [Address] }
    | { __kind: 'Doves'; fields: readonly [Address] };

export type OracleConfigArgs = OracleConfig;

export function getOracleConfigEncoder(): Encoder<OracleConfigArgs> {
    return getDiscriminatedUnionEncoder([
        ['None', getUnitEncoder()],
        [
            'Pyth',
            getStructEncoder([
                [
                    'fields',
                    getTupleEncoder([
                        fixEncoderSize(getBytesEncoder(), 32),
                        transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                    ]),
                ],
            ]),
        ],
        [
            'SwitchboardOnDemand',
            getStructEncoder([
                [
                    'fields',
                    getTupleEncoder([
                        transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                    ]),
                ],
            ]),
        ],
        [
            'Doves',
            getStructEncoder([
                [
                    'fields',
                    getTupleEncoder([
                        transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                    ]),
                ],
            ]),
        ],
    ]);
}

export function getOracleConfigDecoder(): Decoder<OracleConfig> {
    return getDiscriminatedUnionDecoder([
        ['None', getUnitDecoder()],
        [
            'Pyth',
            getStructDecoder([
                [
                    'fields',
                    getTupleDecoder([
                        fixDecoderSize(getBytesDecoder(), 32),
                        transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
                    ]),
                ],
            ]),
        ],
        [
            'SwitchboardOnDemand',
            getStructDecoder([
                [
                    'fields',
                    getTupleDecoder([
                        transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
                    ]),
                ],
            ]),
        ],
        [
            'Doves',
            getStructDecoder([
                [
                    'fields',
                    getTupleDecoder([
                        transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
                    ]),
                ],
            ]),
        ],
    ]);
}

export function getOracleConfigCodec(): Codec<OracleConfigArgs, OracleConfig> {
    return combineCodec(getOracleConfigEncoder(), getOracleConfigDecoder());
}

// Data Enum Helpers.
export function oracleConfig(kind: 'None'): GetDiscriminatedUnionVariant<OracleConfigArgs, '__kind', 'None'>;
export function oracleConfig(
    kind: 'Pyth',
    data: GetDiscriminatedUnionVariantContent<OracleConfigArgs, '__kind', 'Pyth'>['fields'],
): GetDiscriminatedUnionVariant<OracleConfigArgs, '__kind', 'Pyth'>;
export function oracleConfig(
    kind: 'SwitchboardOnDemand',
    data: GetDiscriminatedUnionVariantContent<OracleConfigArgs, '__kind', 'SwitchboardOnDemand'>['fields'],
): GetDiscriminatedUnionVariant<OracleConfigArgs, '__kind', 'SwitchboardOnDemand'>;
export function oracleConfig(
    kind: 'Doves',
    data: GetDiscriminatedUnionVariantContent<OracleConfigArgs, '__kind', 'Doves'>['fields'],
): GetDiscriminatedUnionVariant<OracleConfigArgs, '__kind', 'Doves'>;
export function oracleConfig<K extends OracleConfigArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isOracleConfig<K extends OracleConfig['__kind']>(
    kind: K,
    value: OracleConfig,
): value is OracleConfig & { __kind: K } {
    return value.__kind === kind;
}
