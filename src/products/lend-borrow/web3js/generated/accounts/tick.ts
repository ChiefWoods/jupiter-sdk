import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getI32Decoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type TickAccountData = {
    vaultId: number;
    tick: number;
    isLiquidated: number;
    totalIds: number;
    rawDebt: bigint;
    isFullyLiquidated: number;
    liquidationBranchId: number;
    debtFactor: bigint;
};

export interface TickAccount {
    address: Address;
    data: TickAccountData;
}

function getTickAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    vaultId: number;
    tick: number;
    isLiquidated: number;
    totalIds: number;
    rawDebt: bigint;
    isFullyLiquidated: number;
    liquidationBranchId: number;
    debtFactor: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['vaultId', getU16Decoder()],
        ['tick', getI32Decoder()],
        ['isLiquidated', getU8Decoder()],
        ['totalIds', getU32Decoder()],
        ['rawDebt', getU64Decoder()],
        ['isFullyLiquidated', getU8Decoder()],
        ['liquidationBranchId', getU32Decoder()],
        ['debtFactor', getU64Decoder()],
    ]);
}

export function deserializeTickAccount(data: Uint8Array): TickAccountData {
    const deserialized = getTickAccountDataDecoder().decode(data);
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
