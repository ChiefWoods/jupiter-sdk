import { getU8Codec } from '@solana/codecs';

export enum TicketStatus {
    Pending,
    Accepted,
    Rejected,
    Settled,
    Refunded,
    Claimed,
}

export const ticketStatusCodec = getU8Codec();
