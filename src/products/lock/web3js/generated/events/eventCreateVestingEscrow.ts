import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const EVENT_CREATE_VESTING_ESCROW_DISCRIMINATOR = new Uint8Array([248, 222, 89, 61, 170, 208, 131, 117]);

export function getEventCreateVestingEscrowDiscriminatorBytes(): Uint8Array {
    return EVENT_CREATE_VESTING_ESCROW_DISCRIMINATOR;
}

export type EventCreateVestingEscrow = {
    vestingStartTime: bigint;
    cliffTime: bigint;
    frequency: bigint;
    cliffUnlockAmount: bigint;
    amountPerPeriod: bigint;
    numberOfPeriod: bigint;
    updateRecipientMode: number;
    cancelMode: number;
    recipient: Address;
    escrow: Address;
};

function getEventCreateVestingEscrowDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vestingStartTime', getU64Decoder()],
            ['cliffTime', getU64Decoder()],
            ['frequency', getU64Decoder()],
            ['cliffUnlockAmount', getU64Decoder()],
            ['amountPerPeriod', getU64Decoder()],
            ['numberOfPeriod', getU64Decoder()],
            ['updateRecipientMode', getU8Decoder()],
            ['cancelMode', getU8Decoder()],
            ['recipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(EVENT_CREATE_VESTING_ESCROW_DISCRIMINATOR)],
    );
}

export function parseEventCreateVestingEscrow(data: Uint8Array): EventCreateVestingEscrow {
    if (!EVENT_CREATE_VESTING_ESCROW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventCreateVestingEscrow discriminator mismatch');
    }
    const decoded = getEventCreateVestingEscrowDecoder().decode(data);
    return decoded as EventCreateVestingEscrow;
}
