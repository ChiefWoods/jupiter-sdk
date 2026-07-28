import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** @notice struct to set borrow rate data for version 2 */
export type RateDataV2Params = {
    /**
     *
     * @param kink1 first kink in borrow rate. in 1e2: 100% = 10_000; 1% = 100
     * utilization below kink 1 usually means slow increase in rate, once utilization is above kink 1 borrow rate increases faster
     */
    kink1: bigint;
    /**
     *
     * @param kink2 second kink in borrow rate. in 1e2: 100% = 10_000; 1% = 100
     * utilization below kink 2 usually means slow / medium increase in rate, once utilization is above kink 2 borrow rate increases fast
     */
    kink2: bigint;
    /**
     *
     * @param rateAtUtilizationZero desired borrow rate when utilization is zero. in 1e2: 100% = 10_000; 1% = 100
     * i.e. constant minimum borrow rate
     * e.g. at utilization = 0.01% rate could still be at least 4% (rateAtUtilizationZero would be 400 then)
     */
    rateAtUtilizationZero: bigint;
    /**
     *
     * @param rateAtUtilizationKink1 desired borrow rate when utilization is at first kink. in 1e2: 100% = 10_000; 1% = 100
     * e.g. when rate should be 7% at first kink then rateAtUtilizationKink would be 700
     */
    rateAtUtilizationKink1: bigint;
    /**
     *
     * @param rateAtUtilizationKink2 desired borrow rate when utilization is at second kink. in 1e2: 100% = 10_000; 1% = 100
     * e.g. when rate should be 7% at second kink then rateAtUtilizationKink would be 1_200
     */
    rateAtUtilizationKink2: bigint;
    /**
     *
     * @param rateAtUtilizationMax desired borrow rate when utilization is maximum at 100%. in 1e2: 100% = 10_000; 1% = 100
     * e.g. when rate should be 125% at 100% then rateAtUtilizationMax would be 12_500
     */
    rateAtUtilizationMax: bigint;
};

export type RateDataV2ParamsArgs = {
    /**
     *
     * @param kink1 first kink in borrow rate. in 1e2: 100% = 10_000; 1% = 100
     * utilization below kink 1 usually means slow increase in rate, once utilization is above kink 1 borrow rate increases faster
     */
    kink1: number | bigint;
    /**
     *
     * @param kink2 second kink in borrow rate. in 1e2: 100% = 10_000; 1% = 100
     * utilization below kink 2 usually means slow / medium increase in rate, once utilization is above kink 2 borrow rate increases fast
     */
    kink2: number | bigint;
    /**
     *
     * @param rateAtUtilizationZero desired borrow rate when utilization is zero. in 1e2: 100% = 10_000; 1% = 100
     * i.e. constant minimum borrow rate
     * e.g. at utilization = 0.01% rate could still be at least 4% (rateAtUtilizationZero would be 400 then)
     */
    rateAtUtilizationZero: number | bigint;
    /**
     *
     * @param rateAtUtilizationKink1 desired borrow rate when utilization is at first kink. in 1e2: 100% = 10_000; 1% = 100
     * e.g. when rate should be 7% at first kink then rateAtUtilizationKink would be 700
     */
    rateAtUtilizationKink1: number | bigint;
    /**
     *
     * @param rateAtUtilizationKink2 desired borrow rate when utilization is at second kink. in 1e2: 100% = 10_000; 1% = 100
     * e.g. when rate should be 7% at second kink then rateAtUtilizationKink would be 1_200
     */
    rateAtUtilizationKink2: number | bigint;
    /**
     *
     * @param rateAtUtilizationMax desired borrow rate when utilization is maximum at 100%. in 1e2: 100% = 10_000; 1% = 100
     * e.g. when rate should be 125% at 100% then rateAtUtilizationMax would be 12_500
     */
    rateAtUtilizationMax: number | bigint;
};

export function getRateDataV2ParamsEncoder(): Encoder<RateDataV2ParamsArgs> {
    return getStructEncoder([
        ['kink1', getU128Encoder()],
        ['kink2', getU128Encoder()],
        ['rateAtUtilizationZero', getU128Encoder()],
        ['rateAtUtilizationKink1', getU128Encoder()],
        ['rateAtUtilizationKink2', getU128Encoder()],
        ['rateAtUtilizationMax', getU128Encoder()],
    ]);
}

export function getRateDataV2ParamsDecoder(): Decoder<RateDataV2Params> {
    return getStructDecoder([
        ['kink1', getU128Decoder()],
        ['kink2', getU128Decoder()],
        ['rateAtUtilizationZero', getU128Decoder()],
        ['rateAtUtilizationKink1', getU128Decoder()],
        ['rateAtUtilizationKink2', getU128Decoder()],
        ['rateAtUtilizationMax', getU128Decoder()],
    ]);
}

export function getRateDataV2ParamsCodec(): Codec<RateDataV2ParamsArgs, RateDataV2Params> {
    return combineCodec(getRateDataV2ParamsEncoder(), getRateDataV2ParamsDecoder());
}
