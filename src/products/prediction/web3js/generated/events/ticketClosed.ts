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
import { getTicketStatusDecoder, type TicketStatus } from '../types/ticketStatus';

export const TICKET_CLOSED_DISCRIMINATOR = new Uint8Array([48, 69, 175, 107, 31, 27, 141, 71]);

export function getTicketClosedDiscriminatorBytes(): Uint8Array {
    return TICKET_CLOSED_DISCRIMINATOR;
}

export type TicketClosed = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    status: TicketStatus;
    refundAmount: bigint;
    timestamp: bigint;
    closedBy: Address;
};

function getTicketClosedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['ticket', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['status', getTicketStatusDecoder()],
            ['refundAmount', getU64Decoder()],
            ['timestamp', getI64Decoder()],
            ['closedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(TICKET_CLOSED_DISCRIMINATOR)],
    );
}

export function parseTicketClosed(data: Uint8Array): TicketClosed {
    if (!TICKET_CLOSED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TICKETCLOSED discriminator mismatch');
    }
    const decoded = getTicketClosedDecoder().decode(data);
    return decoded as TicketClosed;
}
