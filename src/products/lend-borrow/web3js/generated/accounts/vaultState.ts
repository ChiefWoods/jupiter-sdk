import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getI32Decoder,
    getStructDecoder,
    getU128Decoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const VAULT_STATE_ACCOUNT_DISCRIMINATOR = new Uint8Array([228, 196, 82, 165, 98, 210, 235, 152]);

export type VaultStateAccountData = {
    vaultId: number;
    branchLiquidated: number;
    topmostTick: number;
    currentBranchId: number;
    totalBranchId: number;
    totalSupply: bigint;
    totalBorrow: bigint;
    totalPositions: number;
    absorbedDebtAmount: bigint;
    absorbedColAmount: bigint;
    absorbedDustDebt: bigint;
    liquiditySupplyExchangePrice: bigint;
    liquidityBorrowExchangePrice: bigint;
    vaultSupplyExchangePrice: bigint;
    vaultBorrowExchangePrice: bigint;
    nextPositionId: number;
    lastUpdateTimestamp: bigint;
};

export interface VaultStateAccount {
    address: Address;
    data: VaultStateAccountData;
}

function getVaultStateAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    vaultId: number;
    branchLiquidated: number;
    topmostTick: number;
    currentBranchId: number;
    totalBranchId: number;
    totalSupply: bigint;
    totalBorrow: bigint;
    totalPositions: number;
    absorbedDebtAmount: bigint;
    absorbedColAmount: bigint;
    absorbedDustDebt: bigint;
    liquiditySupplyExchangePrice: bigint;
    liquidityBorrowExchangePrice: bigint;
    vaultSupplyExchangePrice: bigint;
    vaultBorrowExchangePrice: bigint;
    nextPositionId: number;
    lastUpdateTimestamp: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['vaultId', getU16Decoder()],
        ['branchLiquidated', getU8Decoder()],
        ['topmostTick', getI32Decoder()],
        ['currentBranchId', getU32Decoder()],
        ['totalBranchId', getU32Decoder()],
        ['totalSupply', getU64Decoder()],
        ['totalBorrow', getU64Decoder()],
        ['totalPositions', getU32Decoder()],
        ['absorbedDebtAmount', getU128Decoder()],
        ['absorbedColAmount', getU128Decoder()],
        ['absorbedDustDebt', getU64Decoder()],
        ['liquiditySupplyExchangePrice', getU64Decoder()],
        ['liquidityBorrowExchangePrice', getU64Decoder()],
        ['vaultSupplyExchangePrice', getU64Decoder()],
        ['vaultBorrowExchangePrice', getU64Decoder()],
        ['nextPositionId', getU32Decoder()],
        ['lastUpdateTimestamp', getU64Decoder()],
    ]);
}

export function deserializeVaultStateAccount(data: Uint8Array): VaultStateAccountData {
    if (!VAULT_STATE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VaultStateAccount discriminator mismatch');
    }
    const deserialized = getVaultStateAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VaultStateAccountData;
}

export async function fetchVaultStateAccount(connection: Connection, address: Address): Promise<VaultStateAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('VaultState account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVaultStateAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVaultStateAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VaultStateAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVaultStateAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVaultStateAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<VaultStateAccount[]> {
    const maybeAccounts = await fetchAllMaybeVaultStateAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('VaultState account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VaultStateAccount => a !== null);
}

export async function fetchProgramAccountsVaultState(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VaultStateAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'fGKsWeCxBaF' } }, { dataSize: 127 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVaultStateAccount(account.data),
    }));
}
