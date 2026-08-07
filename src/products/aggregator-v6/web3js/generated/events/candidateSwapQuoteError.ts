import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const CANDIDATE_SWAP_QUOTE_ERROR_DISCRIMINATOR = new Uint8Array([248, 134, 37, 55, 145, 177, 114, 79]);

export function getCandidateSwapQuoteErrorDiscriminatorBytes(): Uint8Array {
    return CANDIDATE_SWAP_QUOTE_ERROR_DISCRIMINATOR;
}

export type CandidateSwapQuoteError = { candidateIndex: bigint; inAmount: bigint; errorCode: bigint };

function getCandidateSwapQuoteErrorDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['candidateIndex', getU64Decoder()],
            ['inAmount', getU64Decoder()],
            ['errorCode', getU64Decoder()],
        ]),
        [getConstantDecoder(CANDIDATE_SWAP_QUOTE_ERROR_DISCRIMINATOR)],
    );
}

export function parseCandidateSwapQuoteError(data: Uint8Array): CandidateSwapQuoteError {
    if (!CANDIDATE_SWAP_QUOTE_ERROR_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CANDIDATESWAPQUOTEERROR discriminator mismatch');
    }
    const decoded = getCandidateSwapQuoteErrorDecoder().decode(data);
    return decoded as CandidateSwapQuoteError;
}
