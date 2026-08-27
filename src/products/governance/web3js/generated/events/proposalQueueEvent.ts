import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const PROPOSAL_QUEUE_DISCRIMINATOR = new Uint8Array([48, 219, 123, 209, 140, 210, 248, 14]);

export function getProposalQueueEventDiscriminatorBytes(): Uint8Array {
    return PROPOSAL_QUEUE_DISCRIMINATOR;
}

export type ProposalQueue = { governor: Address; proposal: Address; transaction: Address };

function getProposalQueueDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['transaction', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(PROPOSAL_QUEUE_DISCRIMINATOR)],
    );
}

export function parseProposalQueue(data: Uint8Array): ProposalQueue {
    if (!PROPOSAL_QUEUE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalQueue discriminator mismatch');
    }
    const decoded = getProposalQueueDecoder().decode(data);
    return decoded as ProposalQueue;
}
