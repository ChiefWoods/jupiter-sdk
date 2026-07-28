import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type Option,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getTicketStatusDecoder, type TicketStatus } from '../types/ticketStatus';

export type TicketAccountData = {
    owner: Address;
    payer: Address;
    settlementMint: Address;
    ticketId: string;
    ticketIdHash: ReadonlyUint8Array;
    marketId: string;
    venueTicketId: Option<string>;
    stakeUsd: bigint;
    maxPayoutUsd: bigint;
    payoutUsd: bigint;
    status: TicketStatus;
    payoutClaimed: boolean;
    createdAt: bigint;
    acceptedAt: bigint;
    settledAt: bigint;
    claimableAt: bigint;
    claimedAt: bigint;
    bump: number;
    unitVersion: number;
    reserved: ReadonlyUint8Array;
};

export interface TicketAccount {
    address: Address;
    data: TicketAccountData;
}

function getTicketAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    owner: Address;
    payer: Address;
    settlementMint: Address;
    ticketId: string;
    ticketIdHash: ReadonlyUint8Array;
    marketId: string;
    venueTicketId: Option<string>;
    stakeUsd: bigint;
    maxPayoutUsd: bigint;
    payoutUsd: bigint;
    status: TicketStatus;
    payoutClaimed: boolean;
    createdAt: bigint;
    acceptedAt: bigint;
    settledAt: bigint;
    claimableAt: bigint;
    claimedAt: bigint;
    bump: number;
    unitVersion: number;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['payer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['settlementMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['ticketIdHash', fixDecoderSize(getBytesDecoder(), 32)],
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['venueTicketId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
        ['stakeUsd', getU64Decoder()],
        ['maxPayoutUsd', getU64Decoder()],
        ['payoutUsd', getU64Decoder()],
        ['status', getTicketStatusDecoder()],
        ['payoutClaimed', getBooleanDecoder()],
        ['createdAt', getI64Decoder()],
        ['acceptedAt', getI64Decoder()],
        ['settledAt', getI64Decoder()],
        ['claimableAt', getI64Decoder()],
        ['claimedAt', getI64Decoder()],
        ['bump', getU8Decoder()],
        ['unitVersion', getU8Decoder()],
        ['reserved', fixDecoderSize(getBytesDecoder(), 120)],
    ]);
}

export function deserializeTicketAccount(data: Uint8Array): TicketAccountData {
    const deserialized = getTicketAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as TicketAccountData;
}

export async function fetchTicketAccount(connection: Connection, address: Address): Promise<TicketAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Ticket account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeTicketAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeTicketAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(TicketAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeTicketAccount(accountInfo.data),
        };
    });
}

export async function fetchAllTicketAccounts(connection: Connection, addresses: Address[]): Promise<TicketAccount[]> {
    const maybeAccounts = await fetchAllMaybeTicketAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Ticket account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is TicketAccount => a !== null);
}

export async function fetchProgramAccountsTicket(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<TicketAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '81PvQMqKDRR' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeTicketAccount(account.data),
    }));
}
