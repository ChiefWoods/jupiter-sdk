import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type UserAccountData = {
    owner: Address;
    referrer: Address;
    referralCount: bigint;
    offerCount: bigint;
    totalLenderLoans: bigint;
    totalBorrowerLoans: bigint;
    totalLenderLiquidations: bigint;
    totalBorrowerLiquidations: bigint;
    updatedAt: bigint;
    createdAt: bigint;
    bump: number;
    padding: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
};

export interface UserAccount {
    address: Address;
    data: UserAccountData;
}

function getUserAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    owner: Address;
    referrer: Address;
    referralCount: bigint;
    offerCount: bigint;
    totalLenderLoans: bigint;
    totalBorrowerLoans: bigint;
    totalLenderLiquidations: bigint;
    totalBorrowerLiquidations: bigint;
    updatedAt: bigint;
    createdAt: bigint;
    bump: number;
    padding: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['referrer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['referralCount', getU64Decoder()],
        ['offerCount', getU64Decoder()],
        ['totalLenderLoans', getU64Decoder()],
        ['totalBorrowerLoans', getU64Decoder()],
        ['totalLenderLiquidations', getU64Decoder()],
        ['totalBorrowerLiquidations', getU64Decoder()],
        ['updatedAt', getU64Decoder()],
        ['createdAt', getU64Decoder()],
        ['bump', getU8Decoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 7)],
        ['reserved', fixDecoderSize(getBytesDecoder(), 64)],
    ]);
}

export function deserializeUserAccount(data: Uint8Array): UserAccountData {
    const deserialized = getUserAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as UserAccountData;
}

export async function fetchUserAccount(connection: Connection, address: Address): Promise<UserAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('User account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeUserAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeUserAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(UserAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeUserAccount(accountInfo.data),
        };
    });
}

export async function fetchAllUserAccounts(connection: Connection, addresses: Address[]): Promise<UserAccount[]> {
    const maybeAccounts = await fetchAllMaybeUserAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('User account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is UserAccount => a !== null);
}

export async function fetchProgramAccountsUser(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<UserAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'TfwwBiNJtao' } }, { dataSize: 208 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeUserAccount(account.data),
    }));
}
