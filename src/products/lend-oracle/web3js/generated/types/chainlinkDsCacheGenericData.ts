import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type ChainlinkDsCacheGenericData = {
    xstocksActivationDateTime: bigint;
    xstocksSuspended: boolean;
    /**
     * Last market status observed from the most recent report (0 = not yet seen / Unknown).
     * Set directly from the report's market_status field on every cache refresh.
     * For V8/V10 feeds this maps to ReportDataMarketStatus; for V11 to ReportDataV11MarketStatus.
     */
    marketStatus: number;
    v11TransitionTimestampS: bigint;
    /** Last current_multiplier seen for this feed via a v10 report. */
    xstocksLastMultiplier: bigint;
    /**
     * `observations_timestamp` (seconds) from the last accepted V10 report.
     * Enforces strictly-monotonic sequencing to prevent replay of old multiplier reports.
     */
    xstocksLastObservationsTimestampMultiplierS: bigint;
    padding: ReadonlyUint8Array;
};

export type ChainlinkDsCacheGenericDataArgs = {
    xstocksActivationDateTime: number | bigint;
    xstocksSuspended: boolean;
    /**
     * Last market status observed from the most recent report (0 = not yet seen / Unknown).
     * Set directly from the report's market_status field on every cache refresh.
     * For V8/V10 feeds this maps to ReportDataMarketStatus; for V11 to ReportDataV11MarketStatus.
     */
    marketStatus: number;
    v11TransitionTimestampS: number | bigint;
    /** Last current_multiplier seen for this feed via a v10 report. */
    xstocksLastMultiplier: number | bigint;
    /**
     * `observations_timestamp` (seconds) from the last accepted V10 report.
     * Enforces strictly-monotonic sequencing to prevent replay of old multiplier reports.
     */
    xstocksLastObservationsTimestampMultiplierS: number | bigint;
    padding: ReadonlyUint8Array;
};

export function getChainlinkDsCacheGenericDataEncoder(): Encoder<ChainlinkDsCacheGenericDataArgs> {
    return getStructEncoder([
        ['xstocksActivationDateTime', getU64Encoder()],
        ['xstocksSuspended', getBooleanEncoder()],
        ['marketStatus', getU32Encoder()],
        ['v11TransitionTimestampS', getU64Encoder()],
        ['xstocksLastMultiplier', getU128Encoder()],
        ['xstocksLastObservationsTimestampMultiplierS', getU64Encoder()],
        ['padding', fixEncoderSize(getBytesEncoder(), 24)],
    ]);
}

export function getChainlinkDsCacheGenericDataDecoder(): Decoder<ChainlinkDsCacheGenericData> {
    return getStructDecoder([
        ['xstocksActivationDateTime', getU64Decoder()],
        ['xstocksSuspended', getBooleanDecoder()],
        ['marketStatus', getU32Decoder()],
        ['v11TransitionTimestampS', getU64Decoder()],
        ['xstocksLastMultiplier', getU128Decoder()],
        ['xstocksLastObservationsTimestampMultiplierS', getU64Decoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 24)],
    ]);
}

export function getChainlinkDsCacheGenericDataCodec(): Codec<
    ChainlinkDsCacheGenericDataArgs,
    ChainlinkDsCacheGenericData
> {
    return combineCodec(getChainlinkDsCacheGenericDataEncoder(), getChainlinkDsCacheGenericDataDecoder());
}
