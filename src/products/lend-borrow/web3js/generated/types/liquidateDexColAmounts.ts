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
 * T2/T4 smart collateral: minimum token amounts per WHOLE collateral share
 * (1e9 precision — Solana DEX shares are 9-decimal, unlike Solidity's 1e18).
 * After the core liquidation, the vault calls DEX `withdraw_perfect` (or
 * `withdraw_perfect_in_one_token`) with per-share slippage bounds computed as
 * `token_per_unit_shares * actual_col_shares / 1e9` (see `SHARES_PRECISION`).
 * Set a field to `0` to receive the full withdrawal in the *other* token only.
 */
export type LiquidateDexColAmounts = { token0PerUnitShares: bigint; token1PerUnitShares: bigint };

export type LiquidateDexColAmountsArgs = { token0PerUnitShares: number | bigint; token1PerUnitShares: number | bigint };

export function getLiquidateDexColAmountsEncoder(): Encoder<LiquidateDexColAmountsArgs> {
    return getStructEncoder([
        ['token0PerUnitShares', getU64Encoder()],
        ['token1PerUnitShares', getU64Encoder()],
    ]);
}

export function getLiquidateDexColAmountsDecoder(): Decoder<LiquidateDexColAmounts> {
    return getStructDecoder([
        ['token0PerUnitShares', getU64Decoder()],
        ['token1PerUnitShares', getU64Decoder()],
    ]);
}

export function getLiquidateDexColAmountsCodec(): Codec<LiquidateDexColAmountsArgs, LiquidateDexColAmounts> {
    return combineCodec(getLiquidateDexColAmountsEncoder(), getLiquidateDexColAmountsDecoder());
}
