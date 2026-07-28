import {
    combineCodec,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getStructDecoder,
    getStructEncoder,
    getTupleDecoder,
    getTupleEncoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
} from '@solana/codecs';

export type CandidateSwapResult =
    | { __kind: 'OutAmount'; fields: readonly [bigint] }
    | { __kind: 'ProgramError'; fields: readonly [bigint] };

export type CandidateSwapResultArgs =
    | { __kind: 'OutAmount'; fields: readonly [number | bigint] }
    | { __kind: 'ProgramError'; fields: readonly [number | bigint] };

export function getCandidateSwapResultEncoder(): Encoder<CandidateSwapResultArgs> {
    return getDiscriminatedUnionEncoder([
        ['OutAmount', getStructEncoder([['fields', getTupleEncoder([getU64Encoder()])]])],
        ['ProgramError', getStructEncoder([['fields', getTupleEncoder([getU64Encoder()])]])],
    ]);
}

export function getCandidateSwapResultDecoder(): Decoder<CandidateSwapResult> {
    return getDiscriminatedUnionDecoder([
        ['OutAmount', getStructDecoder([['fields', getTupleDecoder([getU64Decoder()])]])],
        ['ProgramError', getStructDecoder([['fields', getTupleDecoder([getU64Decoder()])]])],
    ]);
}

export function getCandidateSwapResultCodec(): Codec<CandidateSwapResultArgs, CandidateSwapResult> {
    return combineCodec(getCandidateSwapResultEncoder(), getCandidateSwapResultDecoder());
}

// Data Enum Helpers.
export function candidateSwapResult(
    kind: 'OutAmount',
    data: GetDiscriminatedUnionVariantContent<CandidateSwapResultArgs, '__kind', 'OutAmount'>['fields'],
): GetDiscriminatedUnionVariant<CandidateSwapResultArgs, '__kind', 'OutAmount'>;
export function candidateSwapResult(
    kind: 'ProgramError',
    data: GetDiscriminatedUnionVariantContent<CandidateSwapResultArgs, '__kind', 'ProgramError'>['fields'],
): GetDiscriminatedUnionVariant<CandidateSwapResultArgs, '__kind', 'ProgramError'>;
export function candidateSwapResult<K extends CandidateSwapResultArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isCandidateSwapResult<K extends CandidateSwapResult['__kind']>(
    kind: K,
    value: CandidateSwapResult,
): value is CandidateSwapResult & { __kind: K } {
    return value.__kind === kind;
}
