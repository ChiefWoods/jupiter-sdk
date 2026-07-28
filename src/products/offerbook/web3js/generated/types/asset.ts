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
    getClassicNftAssetDecoder,
    getClassicNftAssetEncoder,
    type ClassicNftAsset,
    type ClassicNftAssetArgs,
} from '../types/classicNftAsset';
import {
    getCoreNftAssetDecoder,
    getCoreNftAssetEncoder,
    type CoreNftAsset,
    type CoreNftAssetArgs,
} from '../types/coreNftAsset';
import {
    getProgrammableNftAssetDecoder,
    getProgrammableNftAssetEncoder,
    type ProgrammableNftAsset,
    type ProgrammableNftAssetArgs,
} from '../types/programmableNftAsset';
import { getTokenAssetDecoder, getTokenAssetEncoder, type TokenAsset, type TokenAssetArgs } from '../types/tokenAsset';

export type Asset =
    | { __kind: 'None' }
    | { __kind: 'Token'; fields: readonly [TokenAsset] }
    | { __kind: 'ClassicNft'; fields: readonly [ClassicNftAsset] }
    | { __kind: 'ProgrammableNft'; fields: readonly [ProgrammableNftAsset] }
    | { __kind: 'CoreNft'; fields: readonly [CoreNftAsset] };

export type AssetArgs =
    | { __kind: 'None' }
    | { __kind: 'Token'; fields: readonly [TokenAssetArgs] }
    | { __kind: 'ClassicNft'; fields: readonly [ClassicNftAssetArgs] }
    | { __kind: 'ProgrammableNft'; fields: readonly [ProgrammableNftAssetArgs] }
    | { __kind: 'CoreNft'; fields: readonly [CoreNftAssetArgs] };

export function getAssetEncoder(): Encoder<AssetArgs> {
    return getDiscriminatedUnionEncoder([
        ['None', getUnitEncoder()],
        ['Token', getStructEncoder([['fields', getTupleEncoder([getTokenAssetEncoder()])]])],
        ['ClassicNft', getStructEncoder([['fields', getTupleEncoder([getClassicNftAssetEncoder()])]])],
        ['ProgrammableNft', getStructEncoder([['fields', getTupleEncoder([getProgrammableNftAssetEncoder()])]])],
        ['CoreNft', getStructEncoder([['fields', getTupleEncoder([getCoreNftAssetEncoder()])]])],
    ]);
}

export function getAssetDecoder(): Decoder<Asset> {
    return getDiscriminatedUnionDecoder([
        ['None', getUnitDecoder()],
        ['Token', getStructDecoder([['fields', getTupleDecoder([getTokenAssetDecoder()])]])],
        ['ClassicNft', getStructDecoder([['fields', getTupleDecoder([getClassicNftAssetDecoder()])]])],
        ['ProgrammableNft', getStructDecoder([['fields', getTupleDecoder([getProgrammableNftAssetDecoder()])]])],
        ['CoreNft', getStructDecoder([['fields', getTupleDecoder([getCoreNftAssetDecoder()])]])],
    ]);
}

export function getAssetCodec(): Codec<AssetArgs, Asset> {
    return combineCodec(getAssetEncoder(), getAssetDecoder());
}

// Data Enum Helpers.
export function asset(kind: 'None'): GetDiscriminatedUnionVariant<AssetArgs, '__kind', 'None'>;
export function asset(
    kind: 'Token',
    data: GetDiscriminatedUnionVariantContent<AssetArgs, '__kind', 'Token'>['fields'],
): GetDiscriminatedUnionVariant<AssetArgs, '__kind', 'Token'>;
export function asset(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<AssetArgs, '__kind', 'ClassicNft'>['fields'],
): GetDiscriminatedUnionVariant<AssetArgs, '__kind', 'ClassicNft'>;
export function asset(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<AssetArgs, '__kind', 'ProgrammableNft'>['fields'],
): GetDiscriminatedUnionVariant<AssetArgs, '__kind', 'ProgrammableNft'>;
export function asset(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<AssetArgs, '__kind', 'CoreNft'>['fields'],
): GetDiscriminatedUnionVariant<AssetArgs, '__kind', 'CoreNft'>;
export function asset<K extends AssetArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isAsset<K extends Asset['__kind']>(kind: K, value: Asset): value is Asset & { __kind: K } {
    return value.__kind === kind;
}
