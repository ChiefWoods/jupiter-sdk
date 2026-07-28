import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum ChainlinkReportType {
    XStocks,
    RWA,
    NAV,
    RWAAdvanced,
    ExchangeRate,
    CryptoPrice,
}

export type ChainlinkReportTypeArgs = ChainlinkReportType;

export function getChainlinkReportTypeEncoder(): Encoder<ChainlinkReportTypeArgs> {
    return getEnumEncoder(ChainlinkReportType);
}

export function getChainlinkReportTypeDecoder(): Decoder<ChainlinkReportType> {
    return getEnumDecoder(ChainlinkReportType);
}

export function getChainlinkReportTypeCodec(): Codec<ChainlinkReportTypeArgs, ChainlinkReportType> {
    return combineCodec(getChainlinkReportTypeEncoder(), getChainlinkReportTypeDecoder());
}
