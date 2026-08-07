import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const EVENT_CLOSE_VESTING_ESCROW_DISCRIMINATOR = new Uint8Array([45, 141, 253, 209, 196, 133, 21, 204]);

export function getEventCloseVestingEscrowDiscriminatorBytes(): Uint8Array {
    return EVENT_CLOSE_VESTING_ESCROW_DISCRIMINATOR;
}

export type EventCloseVestingEscrow = { escrow: Address };

function getEventCloseVestingEscrowDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(EVENT_CLOSE_VESTING_ESCROW_DISCRIMINATOR)],
    );
}

export function parseEventCloseVestingEscrow(data: Uint8Array): EventCloseVestingEscrow {
    if (!EVENT_CLOSE_VESTING_ESCROW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EVENTCLOSEVESTINGESCROW discriminator mismatch');
    }
    const decoded = getEventCloseVestingEscrowDecoder().decode(data);
    return decoded as EventCloseVestingEscrow;
}
