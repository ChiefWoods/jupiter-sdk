import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type UserClaimAccountData = { user: Address; amount: bigint; mint: Address };

export interface UserClaimAccount {
    address: Address;
    data: UserClaimAccountData;
}

function getUserClaimAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    user: Address;
    amount: bigint;
    mint: Address;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['amount', getU64Decoder()],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function deserializeUserClaimAccount(data: Uint8Array): UserClaimAccountData {
    const deserialized = getUserClaimAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as UserClaimAccountData;
}

export async function fetchUserClaimAccount(connection: Connection, address: Address): Promise<UserClaimAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('UserClaim account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeUserClaimAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeUserClaimAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(UserClaimAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeUserClaimAccount(accountInfo.data),
        };
    });
}

export async function fetchAllUserClaimAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<UserClaimAccount[]> {
    const maybeAccounts = await fetchAllMaybeUserClaimAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('UserClaim account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is UserClaimAccount => a !== null);
}

export async function fetchProgramAccountsUserClaim(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<UserClaimAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'fEJ9sCwxX6Y' } }, { dataSize: 80 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeUserClaimAccount(account.data),
    }));
}
