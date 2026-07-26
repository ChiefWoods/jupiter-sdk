import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getI32Codec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
} from '@solana/codecs';

export interface TickAccountData {
    vaultId: number;
    tick: number;
    isLiquidated: number;
    totalIds: number;
    rawDebt: bigint;
    isFullyLiquidated: number;
    liquidationBranchId: number;
    debtFactor: bigint;
}

export interface TickAccount {
    address: Address;
    data: TickAccountData;
}

const TickAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['tick', getI32Codec()],
    ['isLiquidated', getU8Codec()],
    ['totalIds', getU32Codec()],
    ['rawDebt', getU64Codec()],
    ['isFullyLiquidated', getU8Codec()],
    ['liquidationBranchId', getU32Codec()],
    ['debtFactor', getU64Codec()],
]);

export function deserializeTickAccount(data: Uint8Array): TickAccountData {
    const deserialized = TickAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as TickAccountData;
}

export async function fetchTickAccount(connection: Connection, address: Address): Promise<TickAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Tick account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeTickAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeTickAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(TickAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeTickAccount(accountInfo.data),
        };
    });
}

export async function fetchAllTickAccounts(connection: Connection, addresses: Address[]): Promise<TickAccount[]> {
    const maybeAccounts = await fetchAllMaybeTickAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Tick account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is TickAccount => a !== null);
}

export async function fetchProgramAccountsTick(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<TickAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'WVzaTvZ8cUr' } }, { dataSize: 40 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeTickAccount(account.data),
    }));
}
