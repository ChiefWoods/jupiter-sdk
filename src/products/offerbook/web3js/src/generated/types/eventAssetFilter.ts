import { EventCollectionFilter, eventCollectionFilterCodec } from '../types/eventCollectionFilter';
import {
    EventCollectionWithAttributeFilter,
    eventCollectionWithAttributeFilterCodec,
} from '../types/eventCollectionWithAttributeFilter';
import {
    EventFirstVerifiedCreatorFilter,
    eventFirstVerifiedCreatorFilterCodec,
} from '../types/eventFirstVerifiedCreatorFilter';
import { getDiscriminatedUnionCodec, getStructCodec, getTupleCodec, getUnitCodec } from '@solana/codecs';

export type EventAssetFilter =
    | { __kind: 'None' }
    | { __kind: 'Collection'; fields: [EventCollectionFilter] }
    | { __kind: 'FirstVerifiedCreator'; fields: [EventFirstVerifiedCreatorFilter] }
    | { __kind: 'CollectionWithAttribute'; fields: [EventCollectionWithAttributeFilter] };

export const eventAssetFilterCodec = getDiscriminatedUnionCodec([
    ['None', getUnitCodec()],
    ['Collection', getStructCodec([['fields', getTupleCodec([eventCollectionFilterCodec])]])],
    ['FirstVerifiedCreator', getStructCodec([['fields', getTupleCodec([eventFirstVerifiedCreatorFilterCodec])]])],
    ['CollectionWithAttribute', getStructCodec([['fields', getTupleCodec([eventCollectionWithAttributeFilterCodec])]])],
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

export function eventAssetFilter(kind: 'None'): GetDiscriminatedUnionVariant<EventAssetFilter, '__kind', 'None'>;
export function eventAssetFilter(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<EventAssetFilter, '__kind', 'Collection'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetFilter, '__kind', 'Collection'>;
export function eventAssetFilter(
    kind: 'FirstVerifiedCreator',
    data: GetDiscriminatedUnionVariantContent<EventAssetFilter, '__kind', 'FirstVerifiedCreator'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetFilter, '__kind', 'FirstVerifiedCreator'>;
export function eventAssetFilter(
    kind: 'CollectionWithAttribute',
    data: GetDiscriminatedUnionVariantContent<EventAssetFilter, '__kind', 'CollectionWithAttribute'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetFilter, '__kind', 'CollectionWithAttribute'>;
export function eventAssetFilter<K extends EventAssetFilter['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isEventAssetFilter<K extends EventAssetFilter['__kind']>(
    kind: K,
    value: EventAssetFilter,
): value is EventAssetFilter & { __kind: K } {
    return value.__kind === kind;
}
