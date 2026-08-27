import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const EVENT_UPDATE_VESTING_ESCROW_RECIPIENT_DISCRIMINATOR = new Uint8Array([
    206, 218, 33, 65, 133, 237, 131, 57,
]);

export function getEventUpdateVestingEscrowRecipientDiscriminatorBytes(): Uint8Array {
    return EVENT_UPDATE_VESTING_ESCROW_RECIPIENT_DISCRIMINATOR;
}

export type EventUpdateVestingEscrowRecipient = {
    escrow: Address;
    oldRecipient: Address;
    newRecipient: Address;
    signer: Address;
};

function getEventUpdateVestingEscrowRecipientDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['oldRecipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['newRecipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['signer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(EVENT_UPDATE_VESTING_ESCROW_RECIPIENT_DISCRIMINATOR)],
    );
}

export function parseEventUpdateVestingEscrowRecipient(data: Uint8Array): EventUpdateVestingEscrowRecipient {
    if (!EVENT_UPDATE_VESTING_ESCROW_RECIPIENT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventUpdateVestingEscrowRecipient discriminator mismatch');
    }
    const decoded = getEventUpdateVestingEscrowRecipientDecoder().decode(data);
    return decoded as EventUpdateVestingEscrowRecipient;
}
