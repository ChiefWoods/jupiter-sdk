import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU8Decoder,
    getU8Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** @notice struct to set user borrow & payback config */
export type UserBorrowConfig = {
    /**
     *
     * @param mode: 0 = without interest. 1 = with interest
     */
    mode: number;
    /**
     *
     * @param expandPercent debt limit expand percent. in 1e2: 100% = 10_000; 1% = 100
     * Also used to calculate rate at which debt limit should decrease (instant).
     */
    expandPercent: bigint;
    /**
     *
     * @param expandDuration debt limit expand duration in seconds.
     * used to calculate rate together with expandPercent
     */
    expandDuration: bigint;
    /**
     *
     * @param baseDebtCeiling base borrow limit. until here, borrow limit remains as baseDebtCeiling
     * (user can borrow until this point at once without stepped expansion). Above this, automated limit comes in place.
     * amount in raw (to be multiplied with exchange price) or normal depends on configured mode in user config for the token:
     * with interest -> raw, without interest -> normal
     */
    baseDebtCeiling: bigint;
    /**
     *
     * @param maxDebtCeiling max borrow ceiling, maximum amount the user can borrow.
     * amount in raw (to be multiplied with exchange price) or normal depends on configured mode in user config for the token:
     * with interest -> raw, without interest -> normal
     */
    maxDebtCeiling: bigint;
};

export type UserBorrowConfigArgs = {
    /**
     *
     * @param mode: 0 = without interest. 1 = with interest
     */
    mode: number;
    /**
     *
     * @param expandPercent debt limit expand percent. in 1e2: 100% = 10_000; 1% = 100
     * Also used to calculate rate at which debt limit should decrease (instant).
     */
    expandPercent: number | bigint;
    /**
     *
     * @param expandDuration debt limit expand duration in seconds.
     * used to calculate rate together with expandPercent
     */
    expandDuration: number | bigint;
    /**
     *
     * @param baseDebtCeiling base borrow limit. until here, borrow limit remains as baseDebtCeiling
     * (user can borrow until this point at once without stepped expansion). Above this, automated limit comes in place.
     * amount in raw (to be multiplied with exchange price) or normal depends on configured mode in user config for the token:
     * with interest -> raw, without interest -> normal
     */
    baseDebtCeiling: number | bigint;
    /**
     *
     * @param maxDebtCeiling max borrow ceiling, maximum amount the user can borrow.
     * amount in raw (to be multiplied with exchange price) or normal depends on configured mode in user config for the token:
     * with interest -> raw, without interest -> normal
     */
    maxDebtCeiling: number | bigint;
};

export function getUserBorrowConfigEncoder(): Encoder<UserBorrowConfigArgs> {
    return getStructEncoder([
        ['mode', getU8Encoder()],
        ['expandPercent', getU128Encoder()],
        ['expandDuration', getU128Encoder()],
        ['baseDebtCeiling', getU128Encoder()],
        ['maxDebtCeiling', getU128Encoder()],
    ]);
}

export function getUserBorrowConfigDecoder(): Decoder<UserBorrowConfig> {
    return getStructDecoder([
        ['mode', getU8Decoder()],
        ['expandPercent', getU128Decoder()],
        ['expandDuration', getU128Decoder()],
        ['baseDebtCeiling', getU128Decoder()],
        ['maxDebtCeiling', getU128Decoder()],
    ]);
}

export function getUserBorrowConfigCodec(): Codec<UserBorrowConfigArgs, UserBorrowConfig> {
    return combineCodec(getUserBorrowConfigEncoder(), getUserBorrowConfigDecoder());
}
