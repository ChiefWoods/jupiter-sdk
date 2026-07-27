import {
    combineCodec,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getCandidateSwapDecoder,
    getCandidateSwapEncoder,
    type CandidateSwap,
    type CandidateSwapArgs,
} from '../types/candidateSwap';

export type CandidateSwapWithBps = { candidateSwap: CandidateSwap; bps: number };

export type CandidateSwapWithBpsArgs = { candidateSwap: CandidateSwapArgs; bps: number };

export function getCandidateSwapWithBpsEncoder(): Encoder<CandidateSwapWithBpsArgs> {
    return getStructEncoder([
        ['candidateSwap', getCandidateSwapEncoder()],
        ['bps', getU32Encoder()],
    ]);
}

export function getCandidateSwapWithBpsDecoder(): Decoder<CandidateSwapWithBps> {
    return getStructDecoder([
        ['candidateSwap', getCandidateSwapDecoder()],
        ['bps', getU32Decoder()],
    ]);
}

export function getCandidateSwapWithBpsCodec(): Codec<CandidateSwapWithBpsArgs, CandidateSwapWithBps> {
    return combineCodec(getCandidateSwapWithBpsEncoder(), getCandidateSwapWithBpsDecoder());
}
