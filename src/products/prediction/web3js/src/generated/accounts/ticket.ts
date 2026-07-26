import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { TicketStatus, ticketStatusCodec } from '../types/ticketStatus';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getI64Codec,
    getOptionCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';

export interface TicketAccountData {
    owner: Address;
    payer: Address;
    settlementMint: Address;
    ticketId: string;
    ticketIdHash: Uint8Array;
    marketId: string;
    venueTicketId: string | null;
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
    reserved: Uint8Array;
}

export interface TicketAccount {
    address: Address;
    data: TicketAccountData;
}

const TicketAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'owner',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'payer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'settlementMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['ticketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['ticketIdHash', fixCodecSize(getBytesCodec(), 32)],
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['venueTicketId', getOptionCodec(addCodecSizePrefix(getUtf8Codec(), getU32Codec()))],
    ['stakeUsd', getU64Codec()],
    ['maxPayoutUsd', getU64Codec()],
    ['payoutUsd', getU64Codec()],
    ['status', ticketStatusCodec],
    ['payoutClaimed', getBooleanCodec()],
    ['createdAt', getI64Codec()],
    ['acceptedAt', getI64Codec()],
    ['settledAt', getI64Codec()],
    ['claimableAt', getI64Codec()],
    ['claimedAt', getI64Codec()],
    ['bump', getU8Codec()],
    ['unitVersion', getU8Codec()],
    ['reserved', fixCodecSize(getBytesCodec(), 120)],
]);

export function deserializeTicketAccount(data: Uint8Array): TicketAccountData {
    const deserialized = TicketAccountDataCodec.decode(data);
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
