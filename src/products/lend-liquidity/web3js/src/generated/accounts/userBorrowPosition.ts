import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface UserBorrowPositionAccountData {
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
}

export interface UserBorrowPositionAccount {
    address: Address;
    data: UserBorrowPositionAccountData;
}

const UserBorrowPositionAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'protocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['withInterest', getU8Codec()],
    ['amount', getU64Codec()],
    ['debtCeiling', getU64Codec()],
    ['lastUpdate', getU64Codec()],
    ['expandPct', getU16Codec()],
    ['expandDuration', getU32Codec()],
    ['baseDebtCeiling', getU64Codec()],
    ['maxDebtCeiling', getU64Codec()],
    ['status', getU8Codec()],
]);

export function deserializeUserBorrowPositionAccount(data: Uint8Array): UserBorrowPositionAccountData {
    const deserialized = UserBorrowPositionAccountDataCodec.decode(data);
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
