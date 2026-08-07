import { getArrayDecoder, getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';
import { getCandidateSwapResultDecoder, type CandidateSwapResult } from '../types/candidateSwapResult';

export const CANDIDATE_SWAP_RESULTS_DISCRIMINATOR = new Uint8Array([45, 9, 244, 30, 229, 52, 168, 123]);

export function getCandidateSwapResultsDiscriminatorBytes(): Uint8Array {
    return CANDIDATE_SWAP_RESULTS_DISCRIMINATOR;
}

export type CandidateSwapResults = { results: Array<CandidateSwapResult> };

function getCandidateSwapResultsDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['results', getArrayDecoder(getCandidateSwapResultDecoder())]]), [
        getConstantDecoder(CANDIDATE_SWAP_RESULTS_DISCRIMINATOR),
    ]);
}

export function parseCandidateSwapResults(data: Uint8Array): CandidateSwapResults {
    if (!CANDIDATE_SWAP_RESULTS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CANDIDATESWAPRESULTS discriminator mismatch');
    }
    const decoded = getCandidateSwapResultsDecoder().decode(data);
    return decoded as CandidateSwapResults;
}
