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
} from '@solana/codecs';

export type UpdateAuthority =
    | { __kind: 'None' }
    | { __kind: 'Address'; fields: readonly [Address] }
    | { __kind: 'Collection'; fields: readonly [Address] };

export type UpdateAuthorityArgs = UpdateAuthority;

export function getUpdateAuthorityEncoder(): Encoder<UpdateAuthorityArgs> {
    return getDiscriminatedUnionEncoder([
        ['None', getUnitEncoder()],
        [
            'Address',
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
            'Collection',
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

export function getUpdateAuthorityDecoder(): Decoder<UpdateAuthority> {
    return getDiscriminatedUnionDecoder([
        ['None', getUnitDecoder()],
        [
            'Address',
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
            'Collection',
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

export function getUpdateAuthorityCodec(): Codec<UpdateAuthorityArgs, UpdateAuthority> {
    return combineCodec(getUpdateAuthorityEncoder(), getUpdateAuthorityDecoder());
}

// Data Enum Helpers.
export function updateAuthority(kind: 'None'): GetDiscriminatedUnionVariant<UpdateAuthorityArgs, '__kind', 'None'>;
export function updateAuthority(
    kind: 'Address',
    data: GetDiscriminatedUnionVariantContent<UpdateAuthorityArgs, '__kind', 'Address'>['fields'],
): GetDiscriminatedUnionVariant<UpdateAuthorityArgs, '__kind', 'Address'>;
export function updateAuthority(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<UpdateAuthorityArgs, '__kind', 'Collection'>['fields'],
): GetDiscriminatedUnionVariant<UpdateAuthorityArgs, '__kind', 'Collection'>;
export function updateAuthority<K extends UpdateAuthorityArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isUpdateAuthority<K extends UpdateAuthority['__kind']>(
    kind: K,
    value: UpdateAuthority,
): value is UpdateAuthority & { __kind: K } {
    return value.__kind === kind;
}
