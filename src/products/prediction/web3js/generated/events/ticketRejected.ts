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

export const TICKET_REJECTED_DISCRIMINATOR = new Uint8Array([108, 208, 43, 131, 188, 143, 192, 152]);

export function getTicketRejectedDiscriminatorBytes(): Uint8Array {
    return TICKET_REJECTED_DISCRIMINATOR;
}

export type TicketRejected = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    stakeUsd: bigint;
    refundAmount: bigint;
    timestamp: bigint;
    updatedBy: Address;
};

function getTicketRejectedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['ticket', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['stakeUsd', getU64Decoder()],
            ['refundAmount', getU64Decoder()],
            ['timestamp', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(TICKET_REJECTED_DISCRIMINATOR)],
    );
}

export function parseTicketRejected(data: Uint8Array): TicketRejected {
    if (!TICKET_REJECTED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TICKETREJECTED discriminator mismatch');
    }
    const decoded = getTicketRejectedDecoder().decode(data);
    return decoded as TicketRejected;
}
