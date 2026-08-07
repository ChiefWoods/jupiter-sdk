import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const CLAIM_DISCRIMINATOR = new Uint8Array([93, 15, 70, 170, 48, 140, 212, 219]);

export function getClaimEventDiscriminatorBytes(): Uint8Array {
    return CLAIM_DISCRIMINATOR;
}

export type Claim = {
    /** User that claimed. */
    claimant: Address;
    /** Timestamp. */
    timestamp: bigint;
    claimedAmounts: Array<bigint>;
    claimedLootboxes: Array<bigint>;
    accumulatedAmounts: Array<bigint>;
    accumulatedLootboxes: Array<bigint>;
};

function getClaimDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['claimant', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
            ['claimedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
            ['claimedLootboxes', getArrayDecoder(getU64Decoder(), { size: 5 })],
            ['accumulatedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
            ['accumulatedLootboxes', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ]),
        [getConstantDecoder(CLAIM_DISCRIMINATOR)],
    );
}

export function parseClaim(data: Uint8Array): Claim {
    if (!CLAIM_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CLAIM discriminator mismatch');
    }
    const decoded = getClaimDecoder().decode(data);
    return decoded as Claim;
}
