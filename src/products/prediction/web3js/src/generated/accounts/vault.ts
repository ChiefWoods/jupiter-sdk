import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface VaultAccountData {
    settlementMint: Address;
    currentContracts: bigint;
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
}

export interface VaultAccount {
    address: Address;
    data: VaultAccountData;
}

const VaultAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'settlementMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['currentContracts', getU64Codec()],
    ['currentOpenOrders', getU32Codec()],
    ['globalMaxContracts', getU64Codec()],
    ['positionMaxContracts', getU64Codec()],
    ['positionMaxOrders', getU32Codec()],
    ['settlementDelaySeconds', getU64Codec()],
    ['depositsDisabled', getBooleanCodec()],
    ['withdrawalsDisabled', getBooleanCodec()],
    ['protocolFeeBps', getU16Codec()],
    ['bump', getU8Codec()],
    ['tradingDisabled', getBooleanCodec()],
    ['unitVersion', getU8Codec()],
]);

export function deserializeVaultAccount(data: Uint8Array): VaultAccountData {
    const deserialized = VaultAccountDataCodec.decode(data);
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
