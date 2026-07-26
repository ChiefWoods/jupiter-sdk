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

export interface TickIdLiquidationAccountData {
    vaultId: number;
    tick: number;
    tickMap: number;
    isFullyLiquidated1: number;
    liquidationBranchId1: number;
    debtFactor1: bigint;
    isFullyLiquidated2: number;
    liquidationBranchId2: number;
    debtFactor2: bigint;
    isFullyLiquidated3: number;
    liquidationBranchId3: number;
    debtFactor3: bigint;
}

export interface TickIdLiquidationAccount {
    address: Address;
    data: TickIdLiquidationAccountData;
}

const TickIdLiquidationAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['tick', getI32Codec()],
    ['tickMap', getU32Codec()],
    ['isFullyLiquidated1', getU8Codec()],
    ['liquidationBranchId1', getU32Codec()],
    ['debtFactor1', getU64Codec()],
    ['isFullyLiquidated2', getU8Codec()],
    ['liquidationBranchId2', getU32Codec()],
    ['debtFactor2', getU64Codec()],
    ['isFullyLiquidated3', getU8Codec()],
    ['liquidationBranchId3', getU32Codec()],
    ['debtFactor3', getU64Codec()],
]);

export function deserializeTickIdLiquidationAccount(data: Uint8Array): TickIdLiquidationAccountData {
    const deserialized = TickIdLiquidationAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as TickIdLiquidationAccountData;
}

export async function fetchTickIdLiquidationAccount(
    connection: Connection,
    address: Address,
): Promise<TickIdLiquidationAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('TickIdLiquidation account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeTickIdLiquidationAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeTickIdLiquidationAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(TickIdLiquidationAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeTickIdLiquidationAccount(accountInfo.data),
        };
    });
}

export async function fetchAllTickIdLiquidationAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<TickIdLiquidationAccount[]> {
    const maybeAccounts = await fetchAllMaybeTickIdLiquidationAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('TickIdLiquidation account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is TickIdLiquidationAccount => a !== null);
}

export async function fetchProgramAccountsTickIdLiquidation(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<TickIdLiquidationAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '7sqm2MsqJqJ' } }, { dataSize: 57 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeTickIdLiquidationAccount(account.data),
    }));
}
