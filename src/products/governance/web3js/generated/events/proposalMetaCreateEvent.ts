import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU32Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const PROPOSAL_META_CREATE_DISCRIMINATOR = new Uint8Array([50, 59, 195, 75, 85, 227, 187, 82]);

export function getProposalMetaCreateEventDiscriminatorBytes(): Uint8Array {
    return PROPOSAL_META_CREATE_DISCRIMINATOR;
}

export type ProposalMetaCreate = { governor: Address; proposal: Address; title: string; descriptionLink: string };

function getProposalMetaCreateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['title', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['descriptionLink', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ]),
        [getConstantDecoder(PROPOSAL_META_CREATE_DISCRIMINATOR)],
    );
}

export function parseProposalMetaCreate(data: Uint8Array): ProposalMetaCreate {
    if (!PROPOSAL_META_CREATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalMetaCreate discriminator mismatch');
    }
    const decoded = getProposalMetaCreateDecoder().decode(data);
    return decoded as ProposalMetaCreate;
}
