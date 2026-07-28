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

/** @notice struct to set user supply & withdrawal config */
export type UserSupplyConfig = {
    /**
     *
     * @param mode: 0 = without interest. 1 = with interest
     */
    mode: number;
    /**
     *
     * @param expandPercent withdrawal limit expand percent. in 1e2: 100% = 10_000; 1% = 100
     * Also used to calculate rate at which withdrawal limit should decrease (instant).
     */
    expandPercent: bigint;
    /**
     *
     * @param expandDuration withdrawal limit expand duration in seconds.
     * used to calculate rate together with expandPercent
     */
    expandDuration: bigint;
    /**
     *
     * @param baseWithdrawalLimit base limit, below this, user can withdraw the entire amount.
     * amount in raw (to be multiplied with exchange price) or normal depends on configured mode in user config for the token:
     * with interest -> raw, without interest -> normal
     */
    baseWithdrawalLimit: bigint;
};

export type UserSupplyConfigArgs = {
    /**
     *
     * @param mode: 0 = without interest. 1 = with interest
     */
    mode: number;
    /**
     *
     * @param expandPercent withdrawal limit expand percent. in 1e2: 100% = 10_000; 1% = 100
     * Also used to calculate rate at which withdrawal limit should decrease (instant).
     */
    expandPercent: number | bigint;
    /**
     *
     * @param expandDuration withdrawal limit expand duration in seconds.
     * used to calculate rate together with expandPercent
     */
    expandDuration: number | bigint;
    /**
     *
     * @param baseWithdrawalLimit base limit, below this, user can withdraw the entire amount.
     * amount in raw (to be multiplied with exchange price) or normal depends on configured mode in user config for the token:
     * with interest -> raw, without interest -> normal
     */
    baseWithdrawalLimit: number | bigint;
};

export function getUserSupplyConfigEncoder(): Encoder<UserSupplyConfigArgs> {
    return getStructEncoder([
        ['mode', getU8Encoder()],
        ['expandPercent', getU128Encoder()],
        ['expandDuration', getU128Encoder()],
        ['baseWithdrawalLimit', getU128Encoder()],
    ]);
}

export function getUserSupplyConfigDecoder(): Decoder<UserSupplyConfig> {
    return getStructDecoder([
        ['mode', getU8Decoder()],
        ['expandPercent', getU128Decoder()],
        ['expandDuration', getU128Decoder()],
        ['baseWithdrawalLimit', getU128Decoder()],
    ]);
}

export function getUserSupplyConfigCodec(): Codec<UserSupplyConfigArgs, UserSupplyConfig> {
    return combineCodec(getUserSupplyConfigEncoder(), getUserSupplyConfigDecoder());
}
