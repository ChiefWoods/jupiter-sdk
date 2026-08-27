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

export const TICK_ID_LIQUIDATION_ACCOUNT_DISCRIMINATOR = new Uint8Array([41, 28, 190, 197, 68, 213, 31, 181]);

export type TickIdLiquidationAccountData = {
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
};

export interface TickIdLiquidationAccount {
    address: Address;
    data: TickIdLiquidationAccountData;
}

function getTickIdLiquidationAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
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
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['vaultId', getU16Decoder()],
        ['tick', getI32Decoder()],
        ['tickMap', getU32Decoder()],
        ['isFullyLiquidated1', getU8Decoder()],
        ['liquidationBranchId1', getU32Decoder()],
        ['debtFactor1', getU64Decoder()],
        ['isFullyLiquidated2', getU8Decoder()],
        ['liquidationBranchId2', getU32Decoder()],
        ['debtFactor2', getU64Decoder()],
        ['isFullyLiquidated3', getU8Decoder()],
        ['liquidationBranchId3', getU32Decoder()],
        ['debtFactor3', getU64Decoder()],
    ]);
}

export function deserializeTickIdLiquidationAccount(data: Uint8Array): TickIdLiquidationAccountData {
    if (!TICK_ID_LIQUIDATION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TickIdLiquidationAccount discriminator mismatch');
    }
    const deserialized = getTickIdLiquidationAccountDataDecoder().decode(data);
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
