import { Address } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getDiscriminatedUnionCodec,
    getStructCodec,
    transformCodec,
} from '@solana/codecs';

export type NftCollateral =
    | { __kind: 'ClassicNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'ProgrammableNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'CoreNft'; asset: Address }
    | { __kind: 'Collection'; collection: Address }
    | { __kind: 'FirstVerifiedCreator'; creator: Address };

export const nftCollateralCodec = getDiscriminatedUnionCodec([
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
    [
        'Collection',
        getStructCodec([
            [
                'collection',
                transformCodec(
                    fixCodecSize(getBytesCodec(), 32),
                    (value: Address) => value.toBytes(),
                    value => new Address(value),
                ),
            ],
        ]),
    ],
    [
        'FirstVerifiedCreator',
        getStructCodec([
            [
                'creator',
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

export function nftCollateral(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateral, '__kind', 'ClassicNft'>,
): GetDiscriminatedUnionVariant<NftCollateral, '__kind', 'ClassicNft'>;
export function nftCollateral(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateral, '__kind', 'ProgrammableNft'>,
): GetDiscriminatedUnionVariant<NftCollateral, '__kind', 'ProgrammableNft'>;
export function nftCollateral(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateral, '__kind', 'CoreNft'>,
): GetDiscriminatedUnionVariant<NftCollateral, '__kind', 'CoreNft'>;
export function nftCollateral(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<NftCollateral, '__kind', 'Collection'>,
): GetDiscriminatedUnionVariant<NftCollateral, '__kind', 'Collection'>;
export function nftCollateral(
    kind: 'FirstVerifiedCreator',
    data: GetDiscriminatedUnionVariantContent<NftCollateral, '__kind', 'FirstVerifiedCreator'>,
): GetDiscriminatedUnionVariant<NftCollateral, '__kind', 'FirstVerifiedCreator'>;
export function nftCollateral<K extends NftCollateral['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isNftCollateral<K extends NftCollateral['__kind']>(
    kind: K,
    value: NftCollateral,
): value is NftCollateral & { __kind: K } {
    return value.__kind === kind;
}
