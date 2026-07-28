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

export type NftCollateralAsset =
    | { __kind: 'ClassicNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'ProgrammableNft'; mint: Address; tokenProgram: Address }
    | { __kind: 'CoreNft'; asset: Address };

export type NftCollateralAssetArgs = NftCollateralAsset;

export function getNftCollateralAssetEncoder(): Encoder<NftCollateralAssetArgs> {
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
    ]);
}

export function getNftCollateralAssetDecoder(): Decoder<NftCollateralAsset> {
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
    ]);
}

export function getNftCollateralAssetCodec(): Codec<NftCollateralAssetArgs, NftCollateralAsset> {
    return combineCodec(getNftCollateralAssetEncoder(), getNftCollateralAssetDecoder());
}

// Data Enum Helpers.
export function nftCollateralAsset(
    kind: 'ClassicNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralAssetArgs, '__kind', 'ClassicNft'>,
): GetDiscriminatedUnionVariant<NftCollateralAssetArgs, '__kind', 'ClassicNft'>;
export function nftCollateralAsset(
    kind: 'ProgrammableNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralAssetArgs, '__kind', 'ProgrammableNft'>,
): GetDiscriminatedUnionVariant<NftCollateralAssetArgs, '__kind', 'ProgrammableNft'>;
export function nftCollateralAsset(
    kind: 'CoreNft',
    data: GetDiscriminatedUnionVariantContent<NftCollateralAssetArgs, '__kind', 'CoreNft'>,
): GetDiscriminatedUnionVariant<NftCollateralAssetArgs, '__kind', 'CoreNft'>;
export function nftCollateralAsset<K extends NftCollateralAssetArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isNftCollateralAsset<K extends NftCollateralAsset['__kind']>(
    kind: K,
    value: NftCollateralAsset,
): value is NftCollateralAsset & { __kind: K } {
    return value.__kind === kind;
}
