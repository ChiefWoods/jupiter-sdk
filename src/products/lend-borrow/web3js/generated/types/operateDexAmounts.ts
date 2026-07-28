import {
    combineCodec,
    getI128Decoder,
    getI128Encoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/**
 * Smart-side amounts for one imperfect DEX operate leg.
 * `token0` / `token1` — primary token amounts (positive = deposit/borrow, negative = withdraw/payback).
 * `shares_min_max`     — slippage: min shares to receive (deposit/borrow) or max shares to burn (withdraw/payback).
 */
export type OperateDexAmounts = { token0: bigint; token1: bigint; sharesMinMax: bigint };

export type OperateDexAmountsArgs = { token0: number | bigint; token1: number | bigint; sharesMinMax: number | bigint };

export function getOperateDexAmountsEncoder(): Encoder<OperateDexAmountsArgs> {
    return getStructEncoder([
        ['token0', getI128Encoder()],
        ['token1', getI128Encoder()],
        ['sharesMinMax', getI128Encoder()],
    ]);
}

export function getOperateDexAmountsDecoder(): Decoder<OperateDexAmounts> {
    return getStructDecoder([
        ['token0', getI128Decoder()],
        ['token1', getI128Decoder()],
        ['sharesMinMax', getI128Decoder()],
    ]);
}

export function getOperateDexAmountsCodec(): Codec<OperateDexAmountsArgs, OperateDexAmounts> {
    return combineCodec(getOperateDexAmountsEncoder(), getOperateDexAmountsDecoder());
}
