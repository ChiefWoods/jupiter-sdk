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

export const TICKET_CREATED_DISCRIMINATOR = new Uint8Array([122, 222, 128, 213, 63, 50, 51, 110]);

export function getTicketCreatedDiscriminatorBytes(): Uint8Array {
    return TICKET_CREATED_DISCRIMINATOR;
}

export type TicketCreated = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    stakeUsd: bigint;
    timestamp: bigint;
};

function getTicketCreatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['ticket', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['stakeUsd', getU64Decoder()],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(TICKET_CREATED_DISCRIMINATOR)],
    );
}

export function parseTicketCreated(data: Uint8Array): TicketCreated {
    if (!TICKET_CREATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TICKETCREATED discriminator mismatch');
    }
    const decoded = getTicketCreatedDecoder().decode(data);
    return decoded as TicketCreated;
}
