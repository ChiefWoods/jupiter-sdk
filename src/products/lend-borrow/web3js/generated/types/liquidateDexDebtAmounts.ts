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
 * T3/T4 smart debt: liquidator-supplied token amounts + minimum shares to burn.
 * The vault calls DEX `payback(token0, token1, shares_min)`; tokens are debited from
 * the liquidator's DEX pool token accounts (signer-owned ATAs for token0/token1).
 */
export type LiquidateDexDebtAmounts = { token0: bigint; token1: bigint; sharesMin: bigint };

export type LiquidateDexDebtAmountsArgs = {
    token0: number | bigint;
    token1: number | bigint;
    sharesMin: number | bigint;
};

export function getLiquidateDexDebtAmountsEncoder(): Encoder<LiquidateDexDebtAmountsArgs> {
    return getStructEncoder([
        ['token0', getU64Encoder()],
        ['token1', getU64Encoder()],
        ['sharesMin', getU64Encoder()],
    ]);
}

export function getLiquidateDexDebtAmountsDecoder(): Decoder<LiquidateDexDebtAmounts> {
    return getStructDecoder([
        ['token0', getU64Decoder()],
        ['token1', getU64Decoder()],
        ['sharesMin', getU64Decoder()],
    ]);
}

export function getLiquidateDexDebtAmountsCodec(): Codec<LiquidateDexDebtAmountsArgs, LiquidateDexDebtAmounts> {
    return combineCodec(getLiquidateDexDebtAmountsEncoder(), getLiquidateDexDebtAmountsDecoder());
}
