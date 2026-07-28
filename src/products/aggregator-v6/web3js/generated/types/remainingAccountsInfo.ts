import {
    combineCodec,
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getRemainingAccountsSliceDecoder,
    getRemainingAccountsSliceEncoder,
    type RemainingAccountsSlice,
    type RemainingAccountsSliceArgs,
} from '../types/remainingAccountsSlice';

export type RemainingAccountsInfo = { slices: Array<RemainingAccountsSlice> };

export type RemainingAccountsInfoArgs = { slices: Array<RemainingAccountsSliceArgs> };

export function getRemainingAccountsInfoEncoder(): Encoder<RemainingAccountsInfoArgs> {
    return getStructEncoder([['slices', getArrayEncoder(getRemainingAccountsSliceEncoder())]]);
}

export function getRemainingAccountsInfoDecoder(): Decoder<RemainingAccountsInfo> {
    return getStructDecoder([['slices', getArrayDecoder(getRemainingAccountsSliceDecoder())]]);
}

export function getRemainingAccountsInfoCodec(): Codec<RemainingAccountsInfoArgs, RemainingAccountsInfo> {
    return combineCodec(getRemainingAccountsInfoEncoder(), getRemainingAccountsInfoDecoder());
}
