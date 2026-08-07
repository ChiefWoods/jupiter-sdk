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

export const EVENT_CLAIM_V3_DISCRIMINATOR = new Uint8Array([229, 197, 142, 10, 41, 122, 171, 154]);

export function getEventClaimV3DiscriminatorBytes(): Uint8Array {
    return EVENT_CLAIM_V3_DISCRIMINATOR;
}

export type EventClaimV3 = {
    amount: bigint;
    currentTs: bigint;
    escrow: Address;
    vestingStartTime: bigint;
    cliffTime: bigint;
    frequency: bigint;
    cliffUnlockAmount: bigint;
    amountPerPeriod: bigint;
    numberOfPeriod: bigint;
    recipient: Address;
};

function getEventClaimV3Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amount', getU64Decoder()],
            ['currentTs', getU64Decoder()],
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['vestingStartTime', getU64Decoder()],
            ['cliffTime', getU64Decoder()],
            ['frequency', getU64Decoder()],
            ['cliffUnlockAmount', getU64Decoder()],
            ['amountPerPeriod', getU64Decoder()],
            ['numberOfPeriod', getU64Decoder()],
            ['recipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(EVENT_CLAIM_V3_DISCRIMINATOR)],
    );
}

export function parseEventClaimV3(data: Uint8Array): EventClaimV3 {
    if (!EVENT_CLAIM_V3_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EVENTCLAIMV3 discriminator mismatch');
    }
    const decoded = getEventClaimV3Decoder().decode(data);
    return decoded as EventClaimV3;
}
