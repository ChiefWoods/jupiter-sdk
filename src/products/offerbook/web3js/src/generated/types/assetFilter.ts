import { CollectionFilter, collectionFilterCodec } from '../types/collectionFilter';
import {
    CollectionWithAttributeFilter,
    collectionWithAttributeFilterCodec,
} from '../types/collectionWithAttributeFilter';
import { FirstVerifiedCreatorFilter, firstVerifiedCreatorFilterCodec } from '../types/firstVerifiedCreatorFilter';
import { NoFilter, noFilterCodec } from '../types/noFilter';
import { getDiscriminatedUnionCodec, getStructCodec, getTupleCodec } from '@solana/codecs';

export type AssetFilter =
    | { __kind: 'NoFilter'; fields: [NoFilter] }
    | { __kind: 'Collection'; fields: [CollectionFilter] }
    | { __kind: 'FirstVerifiedCreator'; fields: [FirstVerifiedCreatorFilter] }
    | { __kind: 'CollectionWithAttribute'; fields: [CollectionWithAttributeFilter] };

export const assetFilterCodec = getDiscriminatedUnionCodec([
    ['NoFilter', getStructCodec([['fields', getTupleCodec([noFilterCodec])]])],
    ['Collection', getStructCodec([['fields', getTupleCodec([collectionFilterCodec])]])],
    ['FirstVerifiedCreator', getStructCodec([['fields', getTupleCodec([firstVerifiedCreatorFilterCodec])]])],
    ['CollectionWithAttribute', getStructCodec([['fields', getTupleCodec([collectionWithAttributeFilterCodec])]])],
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

export function assetFilter(
    kind: 'NoFilter',
    data: GetDiscriminatedUnionVariantContent<AssetFilter, '__kind', 'NoFilter'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilter, '__kind', 'NoFilter'>;
export function assetFilter(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<AssetFilter, '__kind', 'Collection'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilter, '__kind', 'Collection'>;
export function assetFilter(
    kind: 'FirstVerifiedCreator',
    data: GetDiscriminatedUnionVariantContent<AssetFilter, '__kind', 'FirstVerifiedCreator'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilter, '__kind', 'FirstVerifiedCreator'>;
export function assetFilter(
    kind: 'CollectionWithAttribute',
    data: GetDiscriminatedUnionVariantContent<AssetFilter, '__kind', 'CollectionWithAttribute'>['fields'],
): GetDiscriminatedUnionVariant<AssetFilter, '__kind', 'CollectionWithAttribute'>;
export function assetFilter<K extends AssetFilter['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isAssetFilter<K extends AssetFilter['__kind']>(
    kind: K,
    value: AssetFilter,
): value is AssetFilter & { __kind: K } {
    return value.__kind === kind;
}
