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

export const EVENT_CANCEL_VESTING_ESCROW_DISCRIMINATOR = new Uint8Array([113, 2, 117, 173, 195, 39, 101, 155]);

export function getEventCancelVestingEscrowDiscriminatorBytes(): Uint8Array {
    return EVENT_CANCEL_VESTING_ESCROW_DISCRIMINATOR;
}

export type EventCancelVestingEscrow = {
    escrow: Address;
    signer: Address;
    claimableAmount: bigint;
    remainingAmount: bigint;
    cancelledAt: bigint;
};

function getEventCancelVestingEscrowDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['signer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['claimableAmount', getU64Decoder()],
            ['remainingAmount', getU64Decoder()],
            ['cancelledAt', getU64Decoder()],
        ]),
        [getConstantDecoder(EVENT_CANCEL_VESTING_ESCROW_DISCRIMINATOR)],
    );
}

export function parseEventCancelVestingEscrow(data: Uint8Array): EventCancelVestingEscrow {
    if (!EVENT_CANCEL_VESTING_ESCROW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventCancelVestingEscrow discriminator mismatch');
    }
    const decoded = getEventCancelVestingEscrowDecoder().decode(data);
    return decoded as EventCancelVestingEscrow;
}
