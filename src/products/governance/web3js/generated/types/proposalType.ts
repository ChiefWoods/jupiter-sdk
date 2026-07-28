import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

/** Proposal type */
export enum ProposalType {
    YesNo,
    Option,
}

export type ProposalTypeArgs = ProposalType;

export function getProposalTypeEncoder(): Encoder<ProposalTypeArgs> {
    return getEnumEncoder(ProposalType);
}

export function getProposalTypeDecoder(): Decoder<ProposalType> {
    return getEnumDecoder(ProposalType);
}

export function getProposalTypeCodec(): Codec<ProposalTypeArgs, ProposalType> {
    return combineCodec(getProposalTypeEncoder(), getProposalTypeDecoder());
}
