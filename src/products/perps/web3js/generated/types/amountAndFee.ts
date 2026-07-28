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

export type AmountAndFee = { amount: bigint; fee: bigint; feeBps: bigint };

export type AmountAndFeeArgs = { amount: number | bigint; fee: number | bigint; feeBps: number | bigint };

export function getAmountAndFeeEncoder(): Encoder<AmountAndFeeArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['fee', getU64Encoder()],
        ['feeBps', getU64Encoder()],
    ]);
}

export function getAmountAndFeeDecoder(): Decoder<AmountAndFee> {
    return getStructDecoder([
        ['amount', getU64Decoder()],
        ['fee', getU64Decoder()],
        ['feeBps', getU64Decoder()],
    ]);
}

export function getAmountAndFeeCodec(): Codec<AmountAndFeeArgs, AmountAndFee> {
    return combineCodec(getAmountAndFeeEncoder(), getAmountAndFeeDecoder());
}
