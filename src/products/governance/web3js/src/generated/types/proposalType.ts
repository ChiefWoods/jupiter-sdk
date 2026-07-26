import { getU8Codec } from '@solana/codecs';

export enum ProposalType {
    YesNo,
    Option,
}

export const proposalTypeCodec = getU8Codec();
