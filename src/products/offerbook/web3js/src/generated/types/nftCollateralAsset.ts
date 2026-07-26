import { Address } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    transformCodec,
} from '@solana/codecs';

export type NftCollateralAsset =
    | { __kind: 'ClassicNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'ProgrammableNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'CoreNft'; asset: Address };

export const nftCollateralAssetCodec = getDiscriminatedUnionCodec([
    [
        'ClassicNft',
        getStructCodec([
            [
                'mint',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
            [
                'tokenProgram',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
        ]),
    ],
    [
        'ProgrammableNft',
        getStructCodec([
            [
                'mint',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
            [
                'tokenProgram',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
        ]),
    ],
    [
        'CoreNft',
        getStructCodec([
            [
                'asset',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
        ]),
    ],
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

export function nftCollateralAsset(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralAsset, '__kind', 'ClassicNft'>,
): GetDiscriminatedUnionVariant<NftCollateralAsset, '__kind', 'ClassicNft'>;
export function nftCollateralAsset(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralAsset, '__kind', 'ProgrammableNft'>,
): GetDiscriminatedUnionVariant<NftCollateralAsset, '__kind', 'ProgrammableNft'>;
export function nftCollateralAsset(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralAsset, '__kind', 'CoreNft'>,
): GetDiscriminatedUnionVariant<NftCollateralAsset, '__kind', 'CoreNft'>;
export function nftCollateralAsset<K extends NftCollateralAsset['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isNftCollateralAsset<K extends NftCollateralAsset['__kind']>(
    kind: K,
    value: NftCollateralAsset,
): value is NftCollateralAsset & { __kind: K } {
    return value.__kind === kind;
}
