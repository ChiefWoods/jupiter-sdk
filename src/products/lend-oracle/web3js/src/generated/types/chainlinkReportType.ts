import { getU8Codec } from '@solana/codecs';

export enum ChainlinkReportType {
    XStocks,
    RWA,
    NAV,
    RWAAdvanced,
    ExchangeRate,
    CryptoPrice,
}

export const chainlinkReportTypeCodec = getU8Codec();
