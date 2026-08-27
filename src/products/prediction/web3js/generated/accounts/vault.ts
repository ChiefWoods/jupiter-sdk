import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const VAULT_ACCOUNT_DISCRIMINATOR = new Uint8Array([211, 8, 232, 43, 2, 152, 117, 119]);

export type VaultAccountData = {
    settlementMint: Address;
    currentContracts: bigint;
    /**
     * Legacy unused field retained for account layout compatibility.
     * Position.open_orders is the maintained source of truth for open orders.
     */
    currentOpenOrders: number;
    globalMaxContracts: bigint;
    positionMaxContracts: bigint;
    positionMaxOrders: number;
    settlementDelaySeconds: bigint;
    depositsDisabled: boolean;
    withdrawalsDisabled: boolean;
    protocolFeeBps: number;
    bump: number;
    tradingDisabled: boolean;
    unitVersion: number;
};

export interface VaultAccount {
    address: Address;
    data: VaultAccountData;
}

function getVaultAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    settlementMint: Address;
    currentContracts: bigint;
    /**
     * Legacy unused field retained for account layout compatibility.
     * Position.open_orders is the maintained source of truth for open orders.
     */
    currentOpenOrders: number;
    globalMaxContracts: bigint;
    positionMaxContracts: bigint;
    positionMaxOrders: number;
    settlementDelaySeconds: bigint;
    depositsDisabled: boolean;
    withdrawalsDisabled: boolean;
    protocolFeeBps: number;
    bump: number;
    tradingDisabled: boolean;
    unitVersion: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['settlementMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['currentContracts', getU64Decoder()],
        ['currentOpenOrders', getU32Decoder()],
        ['globalMaxContracts', getU64Decoder()],
        ['positionMaxContracts', getU64Decoder()],
        ['positionMaxOrders', getU32Decoder()],
        ['settlementDelaySeconds', getU64Decoder()],
        ['depositsDisabled', getBooleanDecoder()],
        ['withdrawalsDisabled', getBooleanDecoder()],
        ['protocolFeeBps', getU16Decoder()],
        ['bump', getU8Decoder()],
        ['tradingDisabled', getBooleanDecoder()],
        ['unitVersion', getU8Decoder()],
    ]);
}

export function deserializeVaultAccount(data: Uint8Array): VaultAccountData {
    if (!VAULT_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VaultAccount discriminator mismatch');
    }
    const deserialized = getVaultAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VaultAccountData;
}

export async function fetchVaultAccount(connection: Connection, address: Address): Promise<VaultAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Vault account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVaultAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVaultAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VaultAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVaultAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVaultAccounts(connection: Connection, addresses: Address[]): Promise<VaultAccount[]> {
    const maybeAccounts = await fetchAllMaybeVaultAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Vault account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VaultAccount => a !== null);
}

export async function fetchProgramAccountsVault(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VaultAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'cJJWPqNMczr' } }, { dataSize: 87 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVaultAccount(account.data),
    }));
}
