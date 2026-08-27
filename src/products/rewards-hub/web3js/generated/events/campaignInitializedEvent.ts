import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const CAMPAIGN_INITIALIZED_DISCRIMINATOR = new Uint8Array([62, 247, 61, 179, 223, 177, 191, 212]);

export function getCampaignInitializedEventDiscriminatorBytes(): Uint8Array {
    return CAMPAIGN_INITIALIZED_DISCRIMINATOR;
}

export type CampaignInitialized = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** Mint of the token to be distributed. */
    mint: Address;
    /** Allocated amounts per mission. */
    allocatedAmounts: Array<bigint>;
    /** Start timestamp. */
    startTs: bigint;
    /** End timestamp. */
    endTs: bigint;
    /** Clawback receiver. */
    clawbackReceiver: Address;
};

function getCampaignInitializedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['allocatedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
            ['startTs', getI64Decoder()],
            ['endTs', getI64Decoder()],
            ['clawbackReceiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CAMPAIGN_INITIALIZED_DISCRIMINATOR)],
    );
}

export function parseCampaignInitialized(data: Uint8Array): CampaignInitialized {
    if (!CAMPAIGN_INITIALIZED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CampaignInitialized discriminator mismatch');
    }
    const decoded = getCampaignInitializedDecoder().decode(data);
    return decoded as CampaignInitialized;
}
