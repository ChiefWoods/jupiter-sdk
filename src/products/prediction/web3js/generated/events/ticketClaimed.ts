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

export const TICKET_CLAIMED_DISCRIMINATOR = new Uint8Array([182, 233, 151, 84, 251, 36, 232, 88]);

export function getTicketClaimedDiscriminatorBytes(): Uint8Array {
    return TICKET_CLAIMED_DISCRIMINATOR;
}

export type TicketClaimed = {
    ticket: Address;
    owner: Address;
    ticketId: string;
    marketId: string;
    venueTicketId: Option<string>;
    stakeUsd: bigint;
    maxPayoutUsd: bigint;
    payoutUsd: bigint;
    transferAmountToken: bigint;
    timestamp: bigint;
    updatedBy: Address;
};

function getTicketClaimedDecoder() {
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
            ['transferAmountToken', getU64Decoder()],
            ['timestamp', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(TICKET_CLAIMED_DISCRIMINATOR)],
    );
}

export function parseTicketClaimed(data: Uint8Array): TicketClaimed {
    if (!TICKET_CLAIMED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TICKETCLAIMED discriminator mismatch');
    }
    const decoded = getTicketClaimedDecoder().decode(data);
    return decoded as TicketClaimed;
}
