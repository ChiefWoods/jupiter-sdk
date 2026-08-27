import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const PROPOSAL_ACTIVATE_DISCRIMINATOR = new Uint8Array([247, 53, 166, 250, 118, 62, 53, 80]);

export function getProposalActivateEventDiscriminatorBytes(): Uint8Array {
    return PROPOSAL_ACTIVATE_DISCRIMINATOR;
}

export type ProposalActivate = { governor: Address; proposal: Address; votingEndsAt: bigint };

function getProposalActivateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['votingEndsAt', getI64Decoder()],
        ]),
        [getConstantDecoder(PROPOSAL_ACTIVATE_DISCRIMINATOR)],
    );
}

export function parseProposalActivate(data: Uint8Array): ProposalActivate {
    if (!PROPOSAL_ACTIVATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalActivate discriminator mismatch');
    }
    const decoded = getProposalActivateDecoder().decode(data);
    return decoded as ProposalActivate;
}
