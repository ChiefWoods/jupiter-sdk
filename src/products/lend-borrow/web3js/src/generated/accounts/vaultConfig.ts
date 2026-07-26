import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getI16Codec,
    getStructCodec,
    getU16Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface VaultConfigAccountData {
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
}

export interface VaultConfigAccount {
    address: Address;
    data: VaultConfigAccountData;
}

const VaultConfigAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['supplyRateMagnifier', getI16Codec()],
    ['borrowRateMagnifier', getI16Codec()],
    ['collateralFactor', getU16Codec()],
    ['liquidationThreshold', getU16Codec()],
    ['liquidationMaxLimit', getU16Codec()],
    ['withdrawGap', getU16Codec()],
    ['liquidationPenalty', getU16Codec()],
    ['borrowFee', getU8Codec()],
    ['vaultType', getU8Codec()],
    [
        'oracle',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'rebalancer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'liquidityProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'oracleProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'supplyToken',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'borrowToken',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['bump', getU8Codec()],
]);

export function deserializeVaultConfigAccount(data: Uint8Array): VaultConfigAccountData {
    const deserialized = VaultConfigAccountDataCodec.decode(data);
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
