import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Option,
} from '@solana/codecs';
import { getTicketStatusDecoder, type TicketStatus } from '../types/ticketStatus';

export const TICKET_REFUNDED_DISCRIMINATOR = new Uint8Array([46, 173, 213, 43, 145, 205, 132, 218]);

export function getTicketRefundedDiscriminatorBytes(): Uint8Array {
    return TICKET_REFUNDED_DISCRIMINATOR;
}

export type TicketRefunded = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    venueTicketId: Option<string>;
    previousStatus: TicketStatus;
    previousPayoutUsd: bigint;
    stakeUsd: bigint;
    maxPayoutUsd: bigint;
    refundAmount: bigint;
    transferAmountToken: bigint;
    timestamp: bigint;
    updatedBy: Address;
};

function getTicketRefundedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['ticket', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['venueTicketId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
            ['previousStatus', getTicketStatusDecoder()],
            ['previousPayoutUsd', getU64Decoder()],
            ['stakeUsd', getU64Decoder()],
            ['maxPayoutUsd', getU64Decoder()],
            ['refundAmount', getU64Decoder()],
            ['transferAmountToken', getU64Decoder()],
            ['timestamp', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(TICKET_REFUNDED_DISCRIMINATOR)],
    );
}

export function parseTicketRefunded(data: Uint8Array): TicketRefunded {
    if (!TICKET_REFUNDED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TicketRefunded discriminator mismatch');
    }
    const decoded = getTicketRefundedDecoder().decode(data);
    return decoded as TicketRefunded;
}
