import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const EVENT_CLOSE_CLAIM_STATUS_DISCRIMINATOR = new Uint8Array([87, 68, 38, 194, 241, 155, 125, 107]);

export function getEventCloseClaimStatusDiscriminatorBytes(): Uint8Array {
    return EVENT_CLOSE_CLAIM_STATUS_DISCRIMINATOR;
}

export type EventCloseClaimStatus = { escrow: Address; recipient: Address; rentReceiver: Address };

function getEventCloseClaimStatusDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['recipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['rentReceiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(EVENT_CLOSE_CLAIM_STATUS_DISCRIMINATOR)],
    );
}

export function parseEventCloseClaimStatus(data: Uint8Array): EventCloseClaimStatus {
    if (!EVENT_CLOSE_CLAIM_STATUS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventCloseClaimStatus discriminator mismatch');
    }
    const decoded = getEventCloseClaimStatusDecoder().decode(data);
    return decoded as EventCloseClaimStatus;
}
