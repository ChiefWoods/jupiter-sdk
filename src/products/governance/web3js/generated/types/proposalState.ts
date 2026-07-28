import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

/**
 * The state of a proposal.
 *
 * The `expired` state from Compound is missing here, because the
 * Smart Wallet handles execution.
 */
export enum ProposalState {
    Draft,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
}

export type ProposalStateArgs = ProposalState;

export function getProposalStateEncoder(): Encoder<ProposalStateArgs> {
    return getEnumEncoder(ProposalState);
}

export function getProposalStateDecoder(): Decoder<ProposalState> {
    return getEnumDecoder(ProposalState);
}

export function getProposalStateCodec(): Codec<ProposalStateArgs, ProposalState> {
    return combineCodec(getProposalStateEncoder(), getProposalStateDecoder());
}
