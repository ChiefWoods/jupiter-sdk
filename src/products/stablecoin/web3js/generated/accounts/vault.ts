import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getOracleTypeDecoder, type OracleType } from '../types/oracleType';
import { getPeriodLimitDecoder, type PeriodLimit } from '../types/periodLimit';
import { getVaultStatusDecoder, type VaultStatus } from '../types/vaultStatus';

export type VaultAccountData = {
    mint: Address;
    custodian: Address;
    tokenAccount: Address;
    tokenProgram: Address;
    stalesnessThreshold: bigint;
    minOraclePriceUsd: bigint;
    maxOraclePriceUsd: bigint;
    status: VaultStatus;
    padding1: ReadonlyUint8Array;
    bump: number;
    decimals: number;
    padding2: ReadonlyUint8Array;
    oracles: Array<OracleType>;
    padding3: ReadonlyUint8Array;
    periodLimits: Array<PeriodLimit>;
    reserved1: ReadonlyUint8Array;
    totalMinted: ReadonlyUint8Array;
    totalRedeemed: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
};

export interface VaultAccount {
    address: Address;
    data: VaultAccountData;
}

function getVaultAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    mint: Address;
    custodian: Address;
    tokenAccount: Address;
    tokenProgram: Address;
    stalesnessThreshold: bigint;
    minOraclePriceUsd: bigint;
    maxOraclePriceUsd: bigint;
    status: VaultStatus;
    padding1: ReadonlyUint8Array;
    bump: number;
    decimals: number;
    padding2: ReadonlyUint8Array;
    oracles: Array<OracleType>;
    padding3: ReadonlyUint8Array;
    periodLimits: Array<PeriodLimit>;
    reserved1: ReadonlyUint8Array;
    totalMinted: ReadonlyUint8Array;
    totalRedeemed: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['custodian', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['stalesnessThreshold', getU64Decoder()],
        ['minOraclePriceUsd', getU64Decoder()],
        ['maxOraclePriceUsd', getU64Decoder()],
        ['status', getVaultStatusDecoder()],
        ['padding1', fixDecoderSize(getBytesDecoder(), 7)],
        ['bump', getU8Decoder()],
        ['decimals', getU8Decoder()],
        ['padding2', fixDecoderSize(getBytesDecoder(), 6)],
        ['oracles', getArrayDecoder(getOracleTypeDecoder(), { size: 5 })],
        ['padding3', fixDecoderSize(getBytesDecoder(), 3)],
        ['periodLimits', getArrayDecoder(getPeriodLimitDecoder(), { size: 4 })],
        ['reserved1', fixDecoderSize(getBytesDecoder(), 32)],
        ['totalMinted', fixDecoderSize(getBytesDecoder(), 16)],
        ['totalRedeemed', fixDecoderSize(getBytesDecoder(), 16)],
        ['reserved', fixDecoderSize(getBytesDecoder(), 256)],
    ]);
}

export function deserializeVaultAccount(data: Uint8Array): VaultAccountData {
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
