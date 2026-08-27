import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
} from '@solana/codecs';
import { getProposalInstructionDecoder, type ProposalInstruction } from '../types/proposalInstruction';

export const PROPOSAL_CREATE_DISCRIMINATOR = new Uint8Array([121, 18, 213, 155, 223, 158, 95, 70]);

export function getProposalCreateEventDiscriminatorBytes(): Uint8Array {
    return PROPOSAL_CREATE_DISCRIMINATOR;
}

export type ProposalCreate = {
    governor: Address;
    proposal: Address;
    proposer: Address;
    proposalType: number;
    maxOption: number;
    index: bigint;
    instructions: Array<ProposalInstruction>;
};

function getProposalCreateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposalType', getU8Decoder()],
            ['maxOption', getU8Decoder()],
            ['index', getU64Decoder()],
            ['instructions', getArrayDecoder(getProposalInstructionDecoder())],
        ]),
        [getConstantDecoder(PROPOSAL_CREATE_DISCRIMINATOR)],
    );
}

export function parseProposalCreate(data: Uint8Array): ProposalCreate {
    if (!PROPOSAL_CREATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalCreate discriminator mismatch');
    }
    const decoded = getProposalCreateDecoder().decode(data);
    return decoded as ProposalCreate;
}
