import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type RemainingAccountsSlice = { accountsType: number; length: number };

export type RemainingAccountsSliceArgs = RemainingAccountsSlice;

export function getRemainingAccountsSliceEncoder(): Encoder<RemainingAccountsSliceArgs> {
    return getStructEncoder([
        ['accountsType', getU8Encoder()],
        ['length', getU8Encoder()],
    ]);
}

export function getRemainingAccountsSliceDecoder(): Decoder<RemainingAccountsSlice> {
    return getStructDecoder([
        ['accountsType', getU8Decoder()],
        ['length', getU8Decoder()],
    ]);
}

export function getRemainingAccountsSliceCodec(): Codec<RemainingAccountsSliceArgs, RemainingAccountsSlice> {
    return combineCodec(getRemainingAccountsSliceEncoder(), getRemainingAccountsSliceDecoder());
}
