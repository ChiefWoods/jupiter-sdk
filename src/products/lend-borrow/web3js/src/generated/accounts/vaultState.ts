import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getI32Codec,
    getStructCodec,
    getU128Codec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
} from '@solana/codecs';

export interface VaultStateAccountData {
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
}

export interface VaultStateAccount {
    address: Address;
    data: VaultStateAccountData;
}

const VaultStateAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['branchLiquidated', getU8Codec()],
    ['topmostTick', getI32Codec()],
    ['currentBranchId', getU32Codec()],
    ['totalBranchId', getU32Codec()],
    ['totalSupply', getU64Codec()],
    ['totalBorrow', getU64Codec()],
    ['totalPositions', getU32Codec()],
    ['absorbedDebtAmount', getU128Codec()],
    ['absorbedColAmount', getU128Codec()],
    ['absorbedDustDebt', getU64Codec()],
    ['liquiditySupplyExchangePrice', getU64Codec()],
    ['liquidityBorrowExchangePrice', getU64Codec()],
    ['vaultSupplyExchangePrice', getU64Codec()],
    ['vaultBorrowExchangePrice', getU64Codec()],
    ['nextPositionId', getU32Codec()],
    ['lastUpdateTimestamp', getU64Codec()],
]);

export function deserializeVaultStateAccount(data: Uint8Array): VaultStateAccountData {
    const deserialized = VaultStateAccountDataCodec.decode(data);
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
