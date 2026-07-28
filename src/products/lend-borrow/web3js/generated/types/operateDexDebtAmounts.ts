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
    getOperateDexAmountsDecoder,
    getOperateDexAmountsEncoder,
    type OperateDexAmounts,
    type OperateDexAmountsArgs,
} from '../types/operateDexAmounts';

/**
 * Debt leg for `operate_dex` (imperfect).
 * `amounts`   — DEX amounts for smart debt (T3/T4).
 * `new_debt`  — token delta for non-smart debt (T1/T2).
 */
export type OperateDexDebtAmounts = { amounts: Option<OperateDexAmounts>; newDebt: Option<bigint> };

export type OperateDexDebtAmountsArgs = {
    amounts: OptionOrNullable<OperateDexAmountsArgs>;
    newDebt: OptionOrNullable<number | bigint>;
};

export function getOperateDexDebtAmountsEncoder(): Encoder<OperateDexDebtAmountsArgs> {
    return getStructEncoder([
        ['amounts', getOptionEncoder(getOperateDexAmountsEncoder())],
        ['newDebt', getOptionEncoder(getI128Encoder())],
    ]);
}

export function getOperateDexDebtAmountsDecoder(): Decoder<OperateDexDebtAmounts> {
    return getStructDecoder([
        ['amounts', getOptionDecoder(getOperateDexAmountsDecoder())],
        ['newDebt', getOptionDecoder(getI128Decoder())],
    ]);
}

export function getOperateDexDebtAmountsCodec(): Codec<OperateDexDebtAmountsArgs, OperateDexDebtAmounts> {
    return combineCodec(getOperateDexDebtAmountsEncoder(), getOperateDexDebtAmountsDecoder());
}
