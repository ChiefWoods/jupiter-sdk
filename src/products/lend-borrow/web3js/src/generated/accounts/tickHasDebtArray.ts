import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { TickHasDebt, tickHasDebtCodec } from '../types/tickHasDebt';
import { fixCodecSize, getArrayCodec, getBytesCodec, getStructCodec, getU16Codec, getU8Codec } from '@solana/codecs';

export interface TickHasDebtArrayAccountData {
    vaultId: number;
    index: number;
    tickHasDebt: Array<TickHasDebt>;
}

export interface TickHasDebtArrayAccount {
    address: Address;
    data: TickHasDebtArrayAccountData;
}

const TickHasDebtArrayAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['index', getU8Codec()],
    ['tickHasDebt', getArrayCodec(tickHasDebtCodec, { size: 8 })],
]);

export function deserializeTickHasDebtArrayAccount(data: Uint8Array): TickHasDebtArrayAccountData {
    const deserialized = TickHasDebtArrayAccountDataCodec.decode(data);
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
