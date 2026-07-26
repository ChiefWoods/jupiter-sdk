import { EventClassicNftAsset, eventClassicNftAssetCodec } from '../types/eventClassicNftAsset';
import { EventCoreNftAsset, eventCoreNftAssetCodec } from '../types/eventCoreNftAsset';
import { EventProgrammableNftAsset, eventProgrammableNftAssetCodec } from '../types/eventProgrammableNftAsset';
import { EventTokenAsset, eventTokenAssetCodec } from '../types/eventTokenAsset';
import { getDiscriminatedUnionCodec, getStructCodec, getTupleCodec, getUnitCodec } from '@solana/codecs';

export type EventAsset =
    | { __kind: 'None' }
    | { __kind: 'Token'; fields: [EventTokenAsset] }
    | { __kind: 'ClassicNft'; fields: [EventClassicNftAsset] }
    | { __kind: 'ProgrammableNft'; fields: [EventProgrammableNftAsset] }
    | { __kind: 'CoreNft'; fields: [EventCoreNftAsset] };

export const eventAssetCodec = getDiscriminatedUnionCodec([
    ['None', getUnitCodec()],
    ['Token', getStructCodec([['fields', getTupleCodec([eventTokenAssetCodec])]])],
    ['ClassicNft', getStructCodec([['fields', getTupleCodec([eventClassicNftAssetCodec])]])],
    ['ProgrammableNft', getStructCodec([['fields', getTupleCodec([eventProgrammableNftAssetCodec])]])],
    ['CoreNft', getStructCodec([['fields', getTupleCodec([eventCoreNftAssetCodec])]])],
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

export function eventAsset(kind: 'None'): GetDiscriminatedUnionVariant<EventAsset, '__kind', 'None'>;
export function eventAsset(
    kind: 'Token',
    data: GetDiscriminatedUnionVariantContent<EventAsset, '__kind', 'Token'>['fields'],
): GetDiscriminatedUnionVariant<EventAsset, '__kind', 'Token'>;
export function eventAsset(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<EventAsset, '__kind', 'ClassicNft'>['fields'],
): GetDiscriminatedUnionVariant<EventAsset, '__kind', 'ClassicNft'>;
export function eventAsset(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<EventAsset, '__kind', 'ProgrammableNft'>['fields'],
): GetDiscriminatedUnionVariant<EventAsset, '__kind', 'ProgrammableNft'>;
export function eventAsset(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<EventAsset, '__kind', 'CoreNft'>['fields'],
): GetDiscriminatedUnionVariant<EventAsset, '__kind', 'CoreNft'>;
export function eventAsset<K extends EventAsset['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isEventAsset<K extends EventAsset['__kind']>(
    kind: K,
    value: EventAsset,
): value is EventAsset & { __kind: K } {
    return value.__kind === kind;
}
