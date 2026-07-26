import { ClassicNftAsset, classicNftAssetCodec } from '../types/classicNftAsset';
import { CoreNftAsset, coreNftAssetCodec } from '../types/coreNftAsset';
import { ProgrammableNftAsset, programmableNftAssetCodec } from '../types/programmableNftAsset';
import { TokenAsset, tokenAssetCodec } from '../types/tokenAsset';
import { getDiscriminatedUnionCodec, getStructCodec, getTupleCodec, getUnitCodec } from '@solana/codecs';

export type Asset =
    | { __kind: 'None' }
    | { __kind: 'Token'; fields: [TokenAsset] }
    | { __kind: 'ClassicNft'; fields: [ClassicNftAsset] }
    | { __kind: 'ProgrammableNft'; fields: [ProgrammableNftAsset] }
    | { __kind: 'CoreNft'; fields: [CoreNftAsset] };

export const assetCodec = getDiscriminatedUnionCodec([
    ['None', getUnitCodec()],
    ['Token', getStructCodec([['fields', getTupleCodec([tokenAssetCodec])]])],
    ['ClassicNft', getStructCodec([['fields', getTupleCodec([classicNftAssetCodec])]])],
    ['ProgrammableNft', getStructCodec([['fields', getTupleCodec([programmableNftAssetCodec])]])],
    ['CoreNft', getStructCodec([['fields', getTupleCodec([coreNftAssetCodec])]])],
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

export function asset(kind: 'None'): GetDiscriminatedUnionVariant<Asset, '__kind', 'None'>;
export function asset(
    kind: 'Token',
    data: GetDiscriminatedUnionVariantContent<Asset, '__kind', 'Token'>['fields'],
): GetDiscriminatedUnionVariant<Asset, '__kind', 'Token'>;
export function asset(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<Asset, '__kind', 'ClassicNft'>['fields'],
): GetDiscriminatedUnionVariant<Asset, '__kind', 'ClassicNft'>;
export function asset(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<Asset, '__kind', 'ProgrammableNft'>['fields'],
): GetDiscriminatedUnionVariant<Asset, '__kind', 'ProgrammableNft'>;
export function asset(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<Asset, '__kind', 'CoreNft'>['fields'],
): GetDiscriminatedUnionVariant<Asset, '__kind', 'CoreNft'>;
export function asset<K extends Asset['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isAsset<K extends Asset['__kind']>(kind: K, value: Asset): value is Asset & { __kind: K } {
    return value.__kind === kind;
}
