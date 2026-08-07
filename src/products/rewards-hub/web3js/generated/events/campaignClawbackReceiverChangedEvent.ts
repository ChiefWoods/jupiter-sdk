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

export const CAMPAIGN_CLAWBACK_RECEIVER_CHANGED_DISCRIMINATOR = new Uint8Array([211, 249, 83, 95, 82, 97, 135, 100]);

export function getCampaignClawbackReceiverChangedEventDiscriminatorBytes(): Uint8Array {
    return CAMPAIGN_CLAWBACK_RECEIVER_CHANGED_DISCRIMINATOR;
}

export type CampaignClawbackReceiverChanged = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** New clawback receiver. f */
    newClawbackReceiver: Address;
};

function getCampaignClawbackReceiverChangedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'newClawbackReceiver',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
        ]),
        [getConstantDecoder(CAMPAIGN_CLAWBACK_RECEIVER_CHANGED_DISCRIMINATOR)],
    );
}

export function parseCampaignClawbackReceiverChanged(data: Uint8Array): CampaignClawbackReceiverChanged {
    if (!CAMPAIGN_CLAWBACK_RECEIVER_CHANGED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CAMPAIGNCLAWBACKRECEIVERCHANGED discriminator mismatch');
    }
    const decoded = getCampaignClawbackReceiverChangedDecoder().decode(data);
    return decoded as CampaignClawbackReceiverChanged;
}
