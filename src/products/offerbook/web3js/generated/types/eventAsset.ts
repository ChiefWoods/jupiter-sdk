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
    getEventClassicNftAssetDecoder,
    getEventClassicNftAssetEncoder,
    type EventClassicNftAsset,
    type EventClassicNftAssetArgs,
} from '../types/eventClassicNftAsset';
import {
    getEventCoreNftAssetDecoder,
    getEventCoreNftAssetEncoder,
    type EventCoreNftAsset,
    type EventCoreNftAssetArgs,
} from '../types/eventCoreNftAsset';
import {
    getEventProgrammableNftAssetDecoder,
    getEventProgrammableNftAssetEncoder,
    type EventProgrammableNftAsset,
    type EventProgrammableNftAssetArgs,
} from '../types/eventProgrammableNftAsset';
import {
    getEventTokenAssetDecoder,
    getEventTokenAssetEncoder,
    type EventTokenAsset,
    type EventTokenAssetArgs,
} from '../types/eventTokenAsset';

export type EventAsset =
    | { __kind: 'None' }
    | { __kind: 'Token'; fields: readonly [EventTokenAsset] }
    | { __kind: 'ClassicNft'; fields: readonly [EventClassicNftAsset] }
    | { __kind: 'ProgrammableNft'; fields: readonly [EventProgrammableNftAsset] }
    | { __kind: 'CoreNft'; fields: readonly [EventCoreNftAsset] };

export type EventAssetArgs =
    | { __kind: 'None' }
    | { __kind: 'Token'; fields: readonly [EventTokenAssetArgs] }
    | { __kind: 'ClassicNft'; fields: readonly [EventClassicNftAssetArgs] }
    | { __kind: 'ProgrammableNft'; fields: readonly [EventProgrammableNftAssetArgs] }
    | { __kind: 'CoreNft'; fields: readonly [EventCoreNftAssetArgs] };

export function getEventAssetEncoder(): Encoder<EventAssetArgs> {
    return getDiscriminatedUnionEncoder([
        ['None', getUnitEncoder()],
        ['Token', getStructEncoder([['fields', getTupleEncoder([getEventTokenAssetEncoder()])]])],
        ['ClassicNft', getStructEncoder([['fields', getTupleEncoder([getEventClassicNftAssetEncoder()])]])],
        ['ProgrammableNft', getStructEncoder([['fields', getTupleEncoder([getEventProgrammableNftAssetEncoder()])]])],
        ['CoreNft', getStructEncoder([['fields', getTupleEncoder([getEventCoreNftAssetEncoder()])]])],
    ]);
}

export function getEventAssetDecoder(): Decoder<EventAsset> {
    return getDiscriminatedUnionDecoder([
        ['None', getUnitDecoder()],
        ['Token', getStructDecoder([['fields', getTupleDecoder([getEventTokenAssetDecoder()])]])],
        ['ClassicNft', getStructDecoder([['fields', getTupleDecoder([getEventClassicNftAssetDecoder()])]])],
        ['ProgrammableNft', getStructDecoder([['fields', getTupleDecoder([getEventProgrammableNftAssetDecoder()])]])],
        ['CoreNft', getStructDecoder([['fields', getTupleDecoder([getEventCoreNftAssetDecoder()])]])],
    ]);
}

export function getEventAssetCodec(): Codec<EventAssetArgs, EventAsset> {
    return combineCodec(getEventAssetEncoder(), getEventAssetDecoder());
}

// Data Enum Helpers.
export function eventAsset(kind: 'None'): GetDiscriminatedUnionVariant<EventAssetArgs, '__kind', 'None'>;
export function eventAsset(
    kind: 'Token',
    data: GetDiscriminatedUnionVariantContent<EventAssetArgs, '__kind', 'Token'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetArgs, '__kind', 'Token'>;
export function eventAsset(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<EventAssetArgs, '__kind', 'ClassicNft'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetArgs, '__kind', 'ClassicNft'>;
export function eventAsset(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<EventAssetArgs, '__kind', 'ProgrammableNft'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetArgs, '__kind', 'ProgrammableNft'>;
export function eventAsset(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<EventAssetArgs, '__kind', 'CoreNft'>['fields'],
): GetDiscriminatedUnionVariant<EventAssetArgs, '__kind', 'CoreNft'>;
export function eventAsset<K extends EventAssetArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isEventAsset<K extends EventAsset['__kind']>(
    kind: K,
    value: EventAsset,
): value is EventAsset & { __kind: K } {
    return value.__kind === kind;
}
