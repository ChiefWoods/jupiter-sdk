import {
    combineCodec,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getStructDecoder,
    getStructEncoder,
    getTupleDecoder,
    getTupleEncoder,
    getUnitDecoder,
    getUnitEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
} from '@solana/codecs';
import {
    getEventCollectionFilterDecoder,
    getEventCollectionFilterEncoder,
    type EventCollectionFilter,
    type EventCollectionFilterArgs,
} from '../types/eventCollectionFilter';
import {
    getEventCollectionWithAttributeFilterDecoder,
    getEventCollectionWithAttributeFilterEncoder,
    type EventCollectionWithAttributeFilter,
    type EventCollectionWithAttributeFilterArgs,
} from '../types/eventCollectionWithAttributeFilter';
import {
    getEventFirstVerifiedCreatorFilterDecoder,
    getEventFirstVerifiedCreatorFilterEncoder,
    type EventFirstVerifiedCreatorFilter,
    type EventFirstVerifiedCreatorFilterArgs,
} from '../types/eventFirstVerifiedCreatorFilter';

export type EventAssetFilter =
    | { __kind: 'None' }
    | { __kind: 'Collection'; fields: readonly [EventCollectionFilter] }
    | { __kind: 'FirstVerifiedCreator'; fields: readonly [EventFirstVerifiedCreatorFilter] }
    | { __kind: 'CollectionWithAttribute'; fields: readonly [EventCollectionWithAttributeFilter] };

export type EventAssetFilterArgs =
    | { __kind: 'None' }
    | { __kind: 'Collection'; fields: readonly [EventCollectionFilterArgs] }
    | { __kind: 'FirstVerifiedCreator'; fields: readonly [EventFirstVerifiedCreatorFilterArgs] }
    | { __kind: 'CollectionWithAttribute'; fields: readonly [EventCollectionWithAttributeFilterArgs] };

export function getEventAssetFilterEncoder(): Encoder<EventAssetFilterArgs> {
    return getDiscriminatedUnionEncoder([
        ['None', getUnitEncoder()],
        ['Collection', getStructEncoder([['fields', getTupleEncoder([getEventCollectionFilterEncoder()])]])],
        [
            'FirstVerifiedCreator',
            getStructEncoder([['fields', getTupleEncoder([getEventFirstVerifiedCreatorFilterEncoder()])]]),
        ],
        [
            'CollectionWithAttribute',
            getStructEncoder([['fields', getTupleEncoder([getEventCollectionWithAttributeFilterEncoder()])]]),
        ],
    ]);
}

export function getEventAssetFilterDecoder(): Decoder<EventAssetFilter> {
    return getDiscriminatedUnionDecoder([
        ['None', getUnitDecoder()],
        ['Collection', getStructDecoder([['fields', getTupleDecoder([getEventCollectionFilterDecoder()])]])],
        [
            'FirstVerifiedCreator',
            getStructDecoder([['fields', getTupleDecoder([getEventFirstVerifiedCreatorFilterDecoder()])]]),
        ],
        [
            'CollectionWithAttribute',
            getStructDecoder([['fields', getTupleDecoder([getEventCollectionWithAttributeFilterDecoder()])]]),
        ],
    ]);
}

export function getEventAssetFilterCodec(): Codec<EventAssetFilterArgs, EventAssetFilter> {
    return combineCodec(getEventAssetFilterEncoder(), getEventAssetFilterDecoder());
}

// Data Enum Helpers.
export function eventAssetFilter(kind: 'None'): GetDiscriminatedUnionVariant<EventAssetFilterArgs, '__kind', 'None'>;
export function eventAssetFilter(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<EventAssetFilterArgs, '__kind', 'Collection'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetFilterArgs, '__kind', 'Collection'>;
export function eventAssetFilter(
    kind: 'FirstVerifiedCreator',
    data: GetDiscriminatedUnionVariantContent<EventAssetFilterArgs, '__kind', 'FirstVerifiedCreator'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetFilterArgs, '__kind', 'FirstVerifiedCreator'>;
export function eventAssetFilter(
    kind: 'CollectionWithAttribute',
    data: GetDiscriminatedUnionVariantContent<EventAssetFilterArgs, '__kind', 'CollectionWithAttribute'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetFilterArgs, '__kind', 'CollectionWithAttribute'>;
export function eventAssetFilter<K extends EventAssetFilterArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isEventAssetFilter<K extends EventAssetFilter['__kind']>(
    kind: K,
    value: EventAssetFilter,
): value is EventAssetFilter & { __kind: K } {
    return value.__kind === kind;
}
