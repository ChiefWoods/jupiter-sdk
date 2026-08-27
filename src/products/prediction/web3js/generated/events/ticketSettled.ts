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

export const TICKET_SETTLED_DISCRIMINATOR = new Uint8Array([72, 40, 13, 3, 184, 159, 190, 211]);

export function getTicketSettledDiscriminatorBytes(): Uint8Array {
    return TICKET_SETTLED_DISCRIMINATOR;
}

export type TicketSettled = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    venueTicketId: Option<string>;
    stakeUsd: bigint;
    maxPayoutUsd: bigint;
    payoutUsd: bigint;
    timestamp: bigint;
    updatedBy: Address;
};

function getTicketSettledDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['ticket', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['venueTicketId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
            ['stakeUsd', getU64Decoder()],
            ['maxPayoutUsd', getU64Decoder()],
            ['payoutUsd', getU64Decoder()],
            ['timestamp', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(TICKET_SETTLED_DISCRIMINATOR)],
    );
}

export function parseTicketSettled(data: Uint8Array): TicketSettled {
    if (!TICKET_SETTLED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TicketSettled discriminator mismatch');
    }
    const decoded = getTicketSettledDecoder().decode(data);
    return decoded as TicketSettled;
}
