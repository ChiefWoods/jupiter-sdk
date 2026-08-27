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

export const CAMPAIGN_ADMIN_CHANGED_DISCRIMINATOR = new Uint8Array([49, 222, 104, 253, 31, 101, 68, 181]);

export function getCampaignAdminChangedEventDiscriminatorBytes(): Uint8Array {
    return CAMPAIGN_ADMIN_CHANGED_DISCRIMINATOR;
}

export type CampaignAdminChanged = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** New admin. */
    newAdmin: Address;
};

function getCampaignAdminChangedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['newAdmin', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CAMPAIGN_ADMIN_CHANGED_DISCRIMINATOR)],
    );
}

export function parseCampaignAdminChanged(data: Uint8Array): CampaignAdminChanged {
    if (!CAMPAIGN_ADMIN_CHANGED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CampaignAdminChanged discriminator mismatch');
    }
    const decoded = getCampaignAdminChangedDecoder().decode(data);
    return decoded as CampaignAdminChanged;
}
