import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const PROPOSAL_CANCEL_DISCRIMINATOR = new Uint8Array([24, 49, 11, 182, 23, 59, 122, 220]);

export function getProposalCancelEventDiscriminatorBytes(): Uint8Array {
    return PROPOSAL_CANCEL_DISCRIMINATOR;
}

export type ProposalCancel = { governor: Address; proposal: Address };

function getProposalCancelDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(PROPOSAL_CANCEL_DISCRIMINATOR)],
    );
}

export function parseProposalCancel(data: Uint8Array): ProposalCancel {
    if (!PROPOSAL_CANCEL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalCancel discriminator mismatch');
    }
    const decoded = getProposalCancelDecoder().decode(data);
    return decoded as ProposalCancel;
}
