import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU32Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const OPTION_PROPOSAL_META_CREATE_DISCRIMINATOR = new Uint8Array([120, 126, 65, 125, 85, 200, 75, 206]);

export function getOptionProposalMetaCreateEventDiscriminatorBytes(): Uint8Array {
    return OPTION_PROPOSAL_META_CREATE_DISCRIMINATOR;
}

export type OptionProposalMetaCreate = { governor: Address; proposal: Address; optionDescriptions: Array<string> };

function getOptionProposalMetaCreateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['optionDescriptions', getArrayDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
        ]),
        [getConstantDecoder(OPTION_PROPOSAL_META_CREATE_DISCRIMINATOR)],
    );
}

export function parseOptionProposalMetaCreate(data: Uint8Array): OptionProposalMetaCreate {
    if (!OPTION_PROPOSAL_META_CREATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OPTIONPROPOSALMETACREATE discriminator mismatch');
    }
    const decoded = getOptionProposalMetaCreateDecoder().decode(data);
    return decoded as OptionProposalMetaCreate;
}
