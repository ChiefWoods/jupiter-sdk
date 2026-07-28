import {
    combineCodec,
    getI128Decoder,
    getI128Encoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type Option,
    type OptionOrNullable,
} from '@solana/codecs';
import {
    getOperatePerfectDexAmountsDecoder,
    getOperatePerfectDexAmountsEncoder,
    type OperatePerfectDexAmounts,
    type OperatePerfectDexAmountsArgs,
} from '../types/operatePerfectDexAmounts';

/**
 * Debt leg for `operate_perfect_dex`.
 * `amounts`   — perfect DEX amounts for smart debt (T3/T4).
 * `new_debt`  — token delta for non-smart debt (T1/T2).
 */
export type OperatePerfectDexDebtAmounts = { amounts: Option<OperatePerfectDexAmounts>; newDebt: Option<bigint> };

export type OperatePerfectDexDebtAmountsArgs = {
    amounts: OptionOrNullable<OperatePerfectDexAmountsArgs>;
    newDebt: OptionOrNullable<number | bigint>;
};

export function getOperatePerfectDexDebtAmountsEncoder(): Encoder<OperatePerfectDexDebtAmountsArgs> {
    return getStructEncoder([
        ['amounts', getOptionEncoder(getOperatePerfectDexAmountsEncoder())],
        ['newDebt', getOptionEncoder(getI128Encoder())],
    ]);
}

export function getOperatePerfectDexDebtAmountsDecoder(): Decoder<OperatePerfectDexDebtAmounts> {
    return getStructDecoder([
        ['amounts', getOptionDecoder(getOperatePerfectDexAmountsDecoder())],
        ['newDebt', getOptionDecoder(getI128Decoder())],
    ]);
}

export function getOperatePerfectDexDebtAmountsCodec(): Codec<
    OperatePerfectDexDebtAmountsArgs,
    OperatePerfectDexDebtAmounts
> {
    return combineCodec(getOperatePerfectDexDebtAmountsEncoder(), getOperatePerfectDexDebtAmountsDecoder());
}
