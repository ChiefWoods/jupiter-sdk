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

export const INITIALIZE_CLAIM_STATUS_DISCRIMINATOR = new Uint8Array([121, 167, 244, 185, 162, 207, 107, 234]);

export function getInitializeClaimStatusEventDiscriminatorBytes(): Uint8Array {
    return INITIALIZE_CLAIM_STATUS_DISCRIMINATOR;
}

export type InitializeClaimStatus = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** Claim status public key. */
    claimsPubkey: Address;
};

function getInitializeClaimStatusDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['claimsPubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(INITIALIZE_CLAIM_STATUS_DISCRIMINATOR)],
    );
}

export function parseInitializeClaimStatus(data: Uint8Array): InitializeClaimStatus {
    if (!INITIALIZE_CLAIM_STATUS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InitializeClaimStatus discriminator mismatch');
    }
    const decoded = getInitializeClaimStatusDecoder().decode(data);
    return decoded as InitializeClaimStatus;
}
