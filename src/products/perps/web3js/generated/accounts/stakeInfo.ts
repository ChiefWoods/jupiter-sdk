import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const STAKE_INFO_ACCOUNT_DISCRIMINATOR = new Uint8Array([66, 62, 68, 70, 108, 179, 183, 235]);

export type StakeInfoAccountData = {
    pool: Address;
    stakeAccount: Address;
    currentStakedAmountLamports: bigint;
    totalStakingRewardsLamports: bigint;
    lastUpdatedAt: bigint;
    deactivating: boolean;
    stakeAccountIndex: bigint;
    bump: number;
};

export interface StakeInfoAccount {
    address: Address;
    data: StakeInfoAccountData;
}

function getStakeInfoAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    pool: Address;
    stakeAccount: Address;
    currentStakedAmountLamports: bigint;
    totalStakingRewardsLamports: bigint;
    lastUpdatedAt: bigint;
    deactivating: boolean;
    stakeAccountIndex: bigint;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['stakeAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['currentStakedAmountLamports', getU64Decoder()],
        ['totalStakingRewardsLamports', getU64Decoder()],
        ['lastUpdatedAt', getI64Decoder()],
        ['deactivating', getBooleanDecoder()],
        ['stakeAccountIndex', getU64Decoder()],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeStakeInfoAccount(data: Uint8Array): StakeInfoAccountData {
    if (!STAKE_INFO_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('STAKEINFOACCOUNT discriminator mismatch');
    }
    const deserialized = getStakeInfoAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as StakeInfoAccountData;
}

export async function fetchStakeInfoAccount(connection: Connection, address: Address): Promise<StakeInfoAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('StakeInfo account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeStakeInfoAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeStakeInfoAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(StakeInfoAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeStakeInfoAccount(accountInfo.data),
        };
    });
}

export async function fetchAllStakeInfoAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<StakeInfoAccount[]> {
    const maybeAccounts = await fetchAllMaybeStakeInfoAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('StakeInfo account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is StakeInfoAccount => a !== null);
}

export async function fetchProgramAccountsStakeInfo(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<StakeInfoAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'C5eFiBSQXgv' } }, { dataSize: 106 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeStakeInfoAccount(account.data),
    }));
}
