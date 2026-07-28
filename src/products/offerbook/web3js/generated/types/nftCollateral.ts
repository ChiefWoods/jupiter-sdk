import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
} from '@solana/codecs';

export type NftCollateral =
    | { __kind: 'ClassicNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'ProgrammableNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'CoreNft'; asset: Address }
    | { __kind: 'Collection'; collection: Address }
    | { __kind: 'FirstVerifiedCreator'; creator: Address };

export type NftCollateralArgs = NftCollateral;

export function getNftCollateralEncoder(): Encoder<NftCollateralArgs> {
    return getDiscriminatedUnionEncoder([
        [
            'ClassicNft',
            getStructEncoder([
                ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
                [
                    'tokenProgram',
                    transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                ],
            ]),
        ],
        [
            'ProgrammableNft',
            getStructEncoder([
                ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
                [
                    'tokenProgram',
                    transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                ],
            ]),
        ],
        [
            'CoreNft',
            getStructEncoder([
                ['asset', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
            ]),
        ],
        [
            'Collection',
            getStructEncoder([
                [
                    'collection',
                    transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                ],
            ]),
        ],
        [
            'FirstVerifiedCreator',
            getStructEncoder([
                [
                    'creator',
                    transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
                ],
            ]),
        ],
    ]);
}

export function getNftCollateralDecoder(): Decoder<NftCollateral> {
    return getDiscriminatedUnionDecoder([
        [
            'ClassicNft',
            getStructDecoder([
                ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
                ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ]),
        ],
        [
            'ProgrammableNft',
            getStructDecoder([
                ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
                ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ]),
        ],
        [
            'CoreNft',
            getStructDecoder([
                ['asset', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ]),
        ],
        [
            'Collection',
            getStructDecoder([
                ['collection', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ]),
        ],
        [
            'FirstVerifiedCreator',
            getStructDecoder([
                ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ]),
        ],
    ]);
}

export function getNftCollateralCodec(): Codec<NftCollateralArgs, NftCollateral> {
    return combineCodec(getNftCollateralEncoder(), getNftCollateralDecoder());
}

// Data Enum Helpers.
export function nftCollateral(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralArgs, '__kind', 'ClassicNft'>,
): GetDiscriminatedUnionVariant<NftCollateralArgs, '__kind', 'ClassicNft'>;
export function nftCollateral(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralArgs, '__kind', 'ProgrammableNft'>,
): GetDiscriminatedUnionVariant<NftCollateralArgs, '__kind', 'ProgrammableNft'>;
export function nftCollateral(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralArgs, '__kind', 'CoreNft'>,
): GetDiscriminatedUnionVariant<NftCollateralArgs, '__kind', 'CoreNft'>;
export function nftCollateral(
    kind: 'Collection',
    data: GetDiscriminatedUnionVariantContent<NftCollateralArgs, '__kind', 'Collection'>,
): GetDiscriminatedUnionVariant<NftCollateralArgs, '__kind', 'Collection'>;
export function nftCollateral(
    kind: 'FirstVerifiedCreator',
    data: GetDiscriminatedUnionVariantContent<NftCollateralArgs, '__kind', 'FirstVerifiedCreator'>,
): GetDiscriminatedUnionVariant<NftCollateralArgs, '__kind', 'FirstVerifiedCreator'>;
export function nftCollateral<K extends NftCollateralArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isNftCollateral<K extends NftCollateral['__kind']>(
    kind: K,
    value: NftCollateral,
): value is NftCollateral & { __kind: K } {
    return value.__kind === kind;
}
