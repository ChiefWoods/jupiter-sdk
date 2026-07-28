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
 * Collateral leg for `operate_dex` (imperfect).
 * `amounts`  — DEX amounts for smart col (T2/T4).
 * `new_col`  — token delta for non-smart col (T1/T3).
 */
export type OperateDexColAmounts = { amounts: Option<OperateDexAmounts>; newCol: Option<bigint> };

export type OperateDexColAmountsArgs = {
    amounts: OptionOrNullable<OperateDexAmountsArgs>;
    newCol: OptionOrNullable<number | bigint>;
};

export function getOperateDexColAmountsEncoder(): Encoder<OperateDexColAmountsArgs> {
    return getStructEncoder([
        ['amounts', getOptionEncoder(getOperateDexAmountsEncoder())],
        ['newCol', getOptionEncoder(getI128Encoder())],
    ]);
}

export function getOperateDexColAmountsDecoder(): Decoder<OperateDexColAmounts> {
    return getStructDecoder([
        ['amounts', getOptionDecoder(getOperateDexAmountsDecoder())],
        ['newCol', getOptionDecoder(getI128Decoder())],
    ]);
}

export function getOperateDexColAmountsCodec(): Codec<OperateDexColAmountsArgs, OperateDexColAmounts> {
    return combineCodec(getOperateDexColAmountsEncoder(), getOperateDexColAmountsDecoder());
}
