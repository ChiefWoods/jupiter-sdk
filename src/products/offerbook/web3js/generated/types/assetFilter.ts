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
    getCollectionFilterDecoder,
    getCollectionFilterEncoder,
    type CollectionFilter,
    type CollectionFilterArgs,
} from '../types/collectionFilter';
import {
    getCollectionWithAttributeFilterDecoder,
    getCollectionWithAttributeFilterEncoder,
    type CollectionWithAttributeFilter,
    type CollectionWithAttributeFilterArgs,
} from '../types/collectionWithAttributeFilter';
import {
    getFirstVerifiedCreatorFilterDecoder,
    getFirstVerifiedCreatorFilterEncoder,
    type FirstVerifiedCreatorFilter,
    type FirstVerifiedCreatorFilterArgs,
} from '../types/firstVerifiedCreatorFilter';
import { getNoFilterDecoder, getNoFilterEncoder, type NoFilter, type NoFilterArgs } from '../types/noFilter';

export type AssetFilter =
    | { __kind: 'NoFilter'; fields: readonly [NoFilter] }
    | { __kind: 'Collection'; fields: readonly [CollectionFilter] }
    | { __kind: 'FirstVerifiedCreator'; fields: readonly [FirstVerifiedCreatorFilter] }
    | { __kind: 'CollectionWithAttribute'; fields: readonly [CollectionWithAttributeFilter] };

export type AssetFilterArgs =
    | { __kind: 'NoFilter'; fields: readonly [NoFilterArgs] }
    | { __kind: 'Collection'; fields: readonly [CollectionFilterArgs] }
    | { __kind: 'FirstVerifiedCreator'; fields: readonly [FirstVerifiedCreatorFilterArgs] }
    | { __kind: 'CollectionWithAttribute'; fields: readonly [CollectionWithAttributeFilterArgs] };

export function getAssetFilterEncoder(): Encoder<AssetFilterArgs> {
    return getDiscriminatedUnionEncoder([
        ['NoFilter', getStructEncoder([['fields', getTupleEncoder([getNoFilterEncoder()])]])],
        ['Collection', getStructEncoder([['fields', getTupleEncoder([getCollectionFilterEncoder()])]])],
        [
            'FirstVerifiedCreator',
            getStructEncoder([['fields', getTupleEncoder([getFirstVerifiedCreatorFilterEncoder()])]]),
        ],
        [
            'CollectionWithAttribute',
            getStructEncoder([['fields', getTupleEncoder([getCollectionWithAttributeFilterEncoder()])]]),
        ],
    ]);
}

export function getAssetFilterDecoder(): Decoder<AssetFilter> {
    return getDiscriminatedUnionDecoder([
        ['NoFilter', getStructDecoder([['fields', getTupleDecoder([getNoFilterDecoder()])]])],
        ['Collection', getStructDecoder([['fields', getTupleDecoder([getCollectionFilterDecoder()])]])],
        [
            'FirstVerifiedCreator',
            getStructDecoder([['fields', getTupleDecoder([getFirstVerifiedCreatorFilterDecoder()])]]),
        ],
        [
            'CollectionWithAttribute',
            getStructDecoder([['fields', getTupleDecoder([getCollectionWithAttributeFilterDecoder()])]]),
        ],
    ]);
}

export function getAssetFilterCodec(): Codec<AssetFilterArgs, AssetFilter> {
    return combineCodec(getAssetFilterEncoder(), getAssetFilterDecoder());
}

// Data Enum Helpers.
export function assetFilter(
    kind: 'NoFilter',
    data: GetDiscriminatedUnionVariantContent<AssetFilterArgs, '__kind', 'NoFilter'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilterArgs, '__kind', 'NoFilter'>;
export function assetFilter(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<AssetFilterArgs, '__kind', 'Collection'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilterArgs, '__kind', 'Collection'>;
export function assetFilter(
    kind: 'FirstVerifiedCreator',
    data: GetDiscriminatedUnionVariantContent<AssetFilterArgs, '__kind', 'FirstVerifiedCreator'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilterArgs, '__kind', 'FirstVerifiedCreator'>;
export function assetFilter(
    kind: 'CollectionWithAttribute',
    data: GetDiscriminatedUnionVariantContent<AssetFilterArgs, '__kind', 'CollectionWithAttribute'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilterArgs, '__kind', 'CollectionWithAttribute'>;
export function assetFilter<K extends AssetFilterArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isAssetFilter<K extends AssetFilter['__kind']>(
    kind: K,
    value: AssetFilter,
): value is AssetFilter & { __kind: K } {
    return value.__kind === kind;
}
