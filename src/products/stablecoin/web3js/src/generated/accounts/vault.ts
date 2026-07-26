import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { OracleType, oracleTypeCodec } from '../types/oracleType';
import { PeriodLimit, periodLimitCodec } from '../types/periodLimit';
import { VaultStatus, vaultStatusCodec } from '../types/vaultStatus';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface VaultAccountData {
    mint: Address;
    custodian: Address;
    tokenAccount: Address;
    tokenProgram: Address;
    stalesnessThreshold: bigint;
    minOraclePriceUsd: bigint;
    maxOraclePriceUsd: bigint;
    status: VaultStatus;
    padding1: Uint8Array;
    bump: number;
    decimals: number;
    padding2: Uint8Array;
    oracles: Array<OracleType>;
    padding3: Uint8Array;
    periodLimits: Array<PeriodLimit>;
    reserved1: Uint8Array;
    totalMinted: Uint8Array;
    totalRedeemed: Uint8Array;
    reserved: Uint8Array;
}

export interface VaultAccount {
    address: Address;
    data: VaultAccountData;
}

const VaultAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'custodian',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'tokenAccount',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'tokenProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['stalesnessThreshold', getU64Codec()],
    ['minOraclePriceUsd', getU64Codec()],
    ['maxOraclePriceUsd', getU64Codec()],
    ['status', vaultStatusCodec],
    ['padding1', fixCodecSize(getBytesCodec(), 7)],
    ['bump', getU8Codec()],
    ['decimals', getU8Codec()],
    ['padding2', fixCodecSize(getBytesCodec(), 6)],
    ['oracles', getArrayCodec(oracleTypeCodec, { size: 5 })],
    ['padding3', fixCodecSize(getBytesCodec(), 3)],
    ['periodLimits', getArrayCodec(periodLimitCodec, { size: 4 })],
    ['reserved1', fixCodecSize(getBytesCodec(), 32)],
    ['totalMinted', fixCodecSize(getBytesCodec(), 16)],
    ['totalRedeemed', fixCodecSize(getBytesCodec(), 16)],
    ['reserved', fixCodecSize(getBytesCodec(), 256)],
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
        filters: [
            ...[{ memcmp: { offset: 0, bytes: 'cJJWPqNMczr' } }, { dataSize: 1296 }],
            ...(options?.filters ?? []),
        ],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVaultAccount(account.data),
    }));
}
