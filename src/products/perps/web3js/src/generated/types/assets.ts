import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type Assets = {
    feesReserves: bigint;
    owned: bigint;
    locked: bigint;
    guaranteedUsd: bigint;
    globalShortSizes: bigint;
    globalShortAveragePrices: bigint;
};

export type AssetsArgs = {
    feesReserves: number | bigint;
    owned: number | bigint;
    locked: number | bigint;
    guaranteedUsd: number | bigint;
    globalShortSizes: number | bigint;
    globalShortAveragePrices: number | bigint;
};

export function getAssetsEncoder(): Encoder<AssetsArgs> {
    return getStructEncoder([
        ['feesReserves', getU64Encoder()],
        ['owned', getU64Encoder()],
        ['locked', getU64Encoder()],
        ['guaranteedUsd', getU64Encoder()],
        ['globalShortSizes', getU64Encoder()],
        ['globalShortAveragePrices', getU64Encoder()],
    ]);
}

export function getAssetsDecoder(): Decoder<Assets> {
    return getStructDecoder([
        ['feesReserves', getU64Decoder()],
        ['owned', getU64Decoder()],
        ['locked', getU64Decoder()],
        ['guaranteedUsd', getU64Decoder()],
        ['globalShortSizes', getU64Decoder()],
        ['globalShortAveragePrices', getU64Decoder()],
    ]);
}

export function getAssetsCodec(): Codec<AssetsArgs, Assets> {
    return combineCodec(getAssetsEncoder(), getAssetsDecoder());
}
