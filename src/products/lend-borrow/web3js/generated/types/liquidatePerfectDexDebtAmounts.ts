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

/**
 * T3/T4 smart debt: maximum token amounts per WHOLE debt share for `payback_perfect`
 * (1e9 precision — Solana DEX shares are 9-decimal, unlike Solidity's 1e18).
 * After the core liquidation, the vault calls DEX `payback_perfect` with
 * `token_per_unit_shares * actual_debt_shares / 1e9` as the per-token max
 * (see `SHARES_PRECISION`).
 * Set a field to `0` to pay back entirely in the *other* token only.
 */
export type LiquidatePerfectDexDebtAmounts = { token0PerUnitShares: bigint; token1PerUnitShares: bigint };

export type LiquidatePerfectDexDebtAmountsArgs = {
    token0PerUnitShares: number | bigint;
    token1PerUnitShares: number | bigint;
};

export function getLiquidatePerfectDexDebtAmountsEncoder(): Encoder<LiquidatePerfectDexDebtAmountsArgs> {
    return getStructEncoder([
        ['token0PerUnitShares', getU64Encoder()],
        ['token1PerUnitShares', getU64Encoder()],
    ]);
}

export function getLiquidatePerfectDexDebtAmountsDecoder(): Decoder<LiquidatePerfectDexDebtAmounts> {
    return getStructDecoder([
        ['token0PerUnitShares', getU64Decoder()],
        ['token1PerUnitShares', getU64Decoder()],
    ]);
}

export function getLiquidatePerfectDexDebtAmountsCodec(): Codec<
    LiquidatePerfectDexDebtAmountsArgs,
    LiquidatePerfectDexDebtAmounts
> {
    return combineCodec(getLiquidatePerfectDexDebtAmountsEncoder(), getLiquidatePerfectDexDebtAmountsDecoder());
}
