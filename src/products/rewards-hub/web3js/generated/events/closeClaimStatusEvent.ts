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

export const CLOSE_CLAIM_STATUS_DISCRIMINATOR = new Uint8Array([24, 49, 90, 170, 80, 200, 243, 186]);

export function getCloseClaimStatusEventDiscriminatorBytes(): Uint8Array {
    return CLOSE_CLAIM_STATUS_DISCRIMINATOR;
}

export type CloseClaimStatus = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** Claim status public key. */
    claimsPubkey: Address;
};

function getCloseClaimStatusDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['claimsPubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CLOSE_CLAIM_STATUS_DISCRIMINATOR)],
    );
}

export function parseCloseClaimStatus(data: Uint8Array): CloseClaimStatus {
    if (!CLOSE_CLAIM_STATUS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CloseClaimStatus discriminator mismatch');
    }
    const decoded = getCloseClaimStatusDecoder().decode(data);
    return decoded as CloseClaimStatus;
}
