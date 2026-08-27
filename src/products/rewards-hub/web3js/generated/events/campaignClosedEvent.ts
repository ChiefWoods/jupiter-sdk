import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const CAMPAIGN_CLOSED_DISCRIMINATOR = new Uint8Array([141, 16, 13, 204, 158, 184, 112, 201]);

export function getCampaignClosedEventDiscriminatorBytes(): Uint8Array {
    return CAMPAIGN_CLOSED_DISCRIMINATOR;
}

export type CampaignClosed = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** Amount of tokens left in the vault. */
    remainingAmount: bigint;
    /** Receiver of the remaining tokens. */
    receiver: Address;
};

function getCampaignClosedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['remainingAmount', getU64Decoder()],
            ['receiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CAMPAIGN_CLOSED_DISCRIMINATOR)],
    );
}

export function parseCampaignClosed(data: Uint8Array): CampaignClosed {
    if (!CAMPAIGN_CLOSED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CampaignClosed discriminator mismatch');
    }
    const decoded = getCampaignClosedDecoder().decode(data);
    return decoded as CampaignClosed;
}
