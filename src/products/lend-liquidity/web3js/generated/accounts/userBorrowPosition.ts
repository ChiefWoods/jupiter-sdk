import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
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

export type UserBorrowPositionAccountData = {
    protocol: Address;
    mint: Address;
    withInterest: number;
    amount: bigint;
    debtCeiling: bigint;
    lastUpdate: bigint;
    expandPct: number;
    expandDuration: number;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
    status: number;
};

export interface UserBorrowPositionAccount {
    address: Address;
    data: UserBorrowPositionAccountData;
}

function getUserBorrowPositionAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    protocol: Address;
    mint: Address;
    withInterest: number;
    amount: bigint;
    debtCeiling: bigint;
    lastUpdate: bigint;
    expandPct: number;
    expandDuration: number;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
    status: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['withInterest', getU8Decoder()],
        ['amount', getU64Decoder()],
        ['debtCeiling', getU64Decoder()],
        ['lastUpdate', getU64Decoder()],
        ['expandPct', getU16Decoder()],
        ['expandDuration', getU32Decoder()],
        ['baseDebtCeiling', getU64Decoder()],
        ['maxDebtCeiling', getU64Decoder()],
        ['status', getU8Decoder()],
    ]);
}

export function deserializeUserBorrowPositionAccount(data: Uint8Array): UserBorrowPositionAccountData {
    const deserialized = getUserBorrowPositionAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as UserBorrowPositionAccountData;
}

export async function fetchUserBorrowPositionAccount(
    connection: Connection,
    address: Address,
): Promise<UserBorrowPositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('UserBorrowPosition account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeUserBorrowPositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeUserBorrowPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(UserBorrowPositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeUserBorrowPositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllUserBorrowPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<UserBorrowPositionAccount[]> {
    const maybeAccounts = await fetchAllMaybeUserBorrowPositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('UserBorrowPosition account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is UserBorrowPositionAccount => a !== null);
}

export async function fetchProgramAccountsUserBorrowPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<UserBorrowPositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'DHycAv2QnQ7' } }, { dataSize: 120 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeUserBorrowPositionAccount(account.data),
    }));
}
