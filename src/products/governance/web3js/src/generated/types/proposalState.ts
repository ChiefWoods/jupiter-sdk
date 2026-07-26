import { getU8Codec } from '@solana/codecs';

export enum ProposalState {
    Draft,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
}

export const proposalStateCodec = getU8Codec();
