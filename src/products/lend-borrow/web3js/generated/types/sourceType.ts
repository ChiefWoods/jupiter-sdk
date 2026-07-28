import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum SourceType {
    Pyth,
    StakePool,
    MsolPool,
    Redstone,
    Chainlink,
    SinglePool,
    JupLend,
    ChainlinkDataStreams,
    PstPool,
    DexSmartColPegOracle,
    DexSmartDebtPegOracle,
}

export type SourceTypeArgs = SourceType;

export function getSourceTypeEncoder(): Encoder<SourceTypeArgs> {
    return getEnumEncoder(SourceType);
}

export function getSourceTypeDecoder(): Decoder<SourceType> {
    return getEnumDecoder(SourceType);
}

export function getSourceTypeCodec(): Codec<SourceTypeArgs, SourceType> {
    return combineCodec(getSourceTypeEncoder(), getSourceTypeDecoder());
}
