import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const EVENT_CLAIM_DISCRIMINATOR = new Uint8Array([171, 144, 1, 189, 120, 200, 38, 11]);

export function getEventClaimDiscriminatorBytes(): Uint8Array {
    return EVENT_CLAIM_DISCRIMINATOR;
}

export type EventClaim = { amount: bigint; currentTs: bigint; escrow: Address };

function getEventClaimDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amount', getU64Decoder()],
            ['currentTs', getU64Decoder()],
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(EVENT_CLAIM_DISCRIMINATOR)],
    );
}

export function parseEventClaim(data: Uint8Array): EventClaim {
    if (!EVENT_CLAIM_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventClaim discriminator mismatch');
    }
    const decoded = getEventClaimDecoder().decode(data);
    return decoded as EventClaim;
}
