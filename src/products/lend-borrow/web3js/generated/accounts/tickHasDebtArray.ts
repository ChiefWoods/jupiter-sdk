import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getTickHasDebtDecoder, type TickHasDebt } from '../types/tickHasDebt';

export const TICK_HAS_DEBT_ARRAY_ACCOUNT_DISCRIMINATOR = new Uint8Array([91, 232, 60, 29, 124, 103, 49, 252]);

export type TickHasDebtArrayAccountData = {
    vaultId: number;
    index: number;
    /**
     * Each array contains 8 TickHasDebt structs
     * Each TickHasDebt covers 256 ticks
     * Total: 8 * 256 = 2048 ticks per TickHasDebtArray
     */
    tickHasDebt: Array<TickHasDebt>;
};

export interface TickHasDebtArrayAccount {
    address: Address;
    data: TickHasDebtArrayAccountData;
}

function getTickHasDebtArrayAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    vaultId: number;
    index: number;
    /**
     * Each array contains 8 TickHasDebt structs
     * Each TickHasDebt covers 256 ticks
     * Total: 8 * 256 = 2048 ticks per TickHasDebtArray
     */
    tickHasDebt: Array<TickHasDebt>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['vaultId', getU16Decoder()],
        ['index', getU8Decoder()],
        ['tickHasDebt', getArrayDecoder(getTickHasDebtDecoder(), { size: 8 })],
    ]);
}

export function deserializeTickHasDebtArrayAccount(data: Uint8Array): TickHasDebtArrayAccountData {
    if (!TICK_HAS_DEBT_ARRAY_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TickHasDebtArrayAccount discriminator mismatch');
    }
    const deserialized = getTickHasDebtArrayAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as TickHasDebtArrayAccountData;
}

export async function fetchTickHasDebtArrayAccount(
    connection: Connection,
    address: Address,
): Promise<TickHasDebtArrayAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('TickHasDebtArray account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeTickHasDebtArrayAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeTickHasDebtArrayAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(TickHasDebtArrayAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeTickHasDebtArrayAccount(accountInfo.data),
        };
    });
}

export async function fetchAllTickHasDebtArrayAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<TickHasDebtArrayAccount[]> {
    const maybeAccounts = await fetchAllMaybeTickHasDebtArrayAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('TickHasDebtArray account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is TickHasDebtArrayAccount => a !== null);
}

export async function fetchProgramAccountsTickHasDebtArray(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<TickHasDebtArrayAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'GNcegeC3f6b' } }, { dataSize: 267 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeTickHasDebtArrayAccount(account.data),
    }));
}
