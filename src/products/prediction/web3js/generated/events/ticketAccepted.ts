import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const TICKET_ACCEPTED_DISCRIMINATOR = new Uint8Array([184, 21, 136, 179, 150, 105, 210, 115]);

export function getTicketAcceptedDiscriminatorBytes(): Uint8Array {
    return TICKET_ACCEPTED_DISCRIMINATOR;
}

export type TicketAccepted = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    venueTicketId: string;
    stakeUsd: bigint;
    maxPayoutUsd: bigint;
    timestamp: bigint;
    updatedBy: Address;
};

function getTicketAcceptedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['ticket', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['venueTicketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['stakeUsd', getU64Decoder()],
            ['maxPayoutUsd', getU64Decoder()],
            ['timestamp', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(TICKET_ACCEPTED_DISCRIMINATOR)],
    );
}

export function parseTicketAccepted(data: Uint8Array): TicketAccepted {
    if (!TICKET_ACCEPTED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TicketAccepted discriminator mismatch');
    }
    const decoded = getTicketAcceptedDecoder().decode(data);
    return decoded as TicketAccepted;
}
