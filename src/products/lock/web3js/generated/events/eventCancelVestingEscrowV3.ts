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

export const EVENT_CANCEL_VESTING_ESCROW_V3_DISCRIMINATOR = new Uint8Array([41, 143, 236, 79, 116, 120, 91, 143]);

export function getEventCancelVestingEscrowV3DiscriminatorBytes(): Uint8Array {
    return EVENT_CANCEL_VESTING_ESCROW_V3_DISCRIMINATOR;
}

export type EventCancelVestingEscrowV3 = {
    escrow: Address;
    signer: Address;
    remainingAmount: bigint;
    cancelledAt: bigint;
};

function getEventCancelVestingEscrowV3Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['signer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['remainingAmount', getU64Decoder()],
            ['cancelledAt', getU64Decoder()],
        ]),
        [getConstantDecoder(EVENT_CANCEL_VESTING_ESCROW_V3_DISCRIMINATOR)],
    );
}

export function parseEventCancelVestingEscrowV3(data: Uint8Array): EventCancelVestingEscrowV3 {
    if (!EVENT_CANCEL_VESTING_ESCROW_V3_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventCancelVestingEscrowV3 discriminator mismatch');
    }
    const decoded = getEventCancelVestingEscrowV3Decoder().decode(data);
    return decoded as EventCancelVestingEscrowV3;
}
