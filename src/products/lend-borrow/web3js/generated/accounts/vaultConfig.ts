import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getI16Decoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const VAULT_CONFIG_ACCOUNT_DISCRIMINATOR = new Uint8Array([99, 86, 43, 216, 184, 102, 119, 77]);

export type VaultConfigAccountData = {
    vaultId: number;
    supplyRateMagnifier: number;
    borrowRateMagnifier: number;
    collateralFactor: number;
    liquidationThreshold: number;
    liquidationMaxLimit: number;
    withdrawGap: number;
    liquidationPenalty: number;
    borrowFee: number;
    vaultType: number;
    oracle: Address;
    rebalancer: Address;
    liquidityProgram: Address;
    oracleProgram: Address;
    supplyToken: Address;
    borrowToken: Address;
    bump: number;
};

export interface VaultConfigAccount {
    address: Address;
    data: VaultConfigAccountData;
}

function getVaultConfigAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    vaultId: number;
    supplyRateMagnifier: number;
    borrowRateMagnifier: number;
    collateralFactor: number;
    liquidationThreshold: number;
    liquidationMaxLimit: number;
    withdrawGap: number;
    liquidationPenalty: number;
    borrowFee: number;
    vaultType: number;
    oracle: Address;
    rebalancer: Address;
    liquidityProgram: Address;
    oracleProgram: Address;
    supplyToken: Address;
    borrowToken: Address;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['vaultId', getU16Decoder()],
        ['supplyRateMagnifier', getI16Decoder()],
        ['borrowRateMagnifier', getI16Decoder()],
        ['collateralFactor', getU16Decoder()],
        ['liquidationThreshold', getU16Decoder()],
        ['liquidationMaxLimit', getU16Decoder()],
        ['withdrawGap', getU16Decoder()],
        ['liquidationPenalty', getU16Decoder()],
        ['borrowFee', getU8Decoder()],
        ['vaultType', getU8Decoder()],
        ['oracle', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['rebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['oracleProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyToken', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrowToken', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeVaultConfigAccount(data: Uint8Array): VaultConfigAccountData {
    if (!VAULT_CONFIG_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VAULTCONFIGACCOUNT discriminator mismatch');
    }
    const deserialized = getVaultConfigAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VaultConfigAccountData;
}

export async function fetchVaultConfigAccount(connection: Connection, address: Address): Promise<VaultConfigAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('VaultConfig account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVaultConfigAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVaultConfigAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VaultConfigAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVaultConfigAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVaultConfigAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<VaultConfigAccount[]> {
    const maybeAccounts = await fetchAllMaybeVaultConfigAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('VaultConfig account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VaultConfigAccount => a !== null);
}

export async function fetchProgramAccountsVaultConfig(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VaultConfigAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'HcgzY9wQbFa' } }, { dataSize: 219 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVaultConfigAccount(account.data),
    }));
}
