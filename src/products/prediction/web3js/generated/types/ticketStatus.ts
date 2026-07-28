import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum TicketStatus {
    Pending,
    Accepted,
    Rejected,
    Settled,
    Refunded,
    Claimed,
}

export type TicketStatusArgs = TicketStatus;

export function getTicketStatusEncoder(): Encoder<TicketStatusArgs> {
    return getEnumEncoder(TicketStatus);
}

export function getTicketStatusDecoder(): Decoder<TicketStatus> {
    return getEnumDecoder(TicketStatus);
}

export function getTicketStatusCodec(): Codec<TicketStatusArgs, TicketStatus> {
    return combineCodec(getTicketStatusEncoder(), getTicketStatusDecoder());
}
