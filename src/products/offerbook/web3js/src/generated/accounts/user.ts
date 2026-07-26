import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU64Codec, getU8Codec, transformCodec } from '@solana/codecs';

export interface UserAccountData {
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
    padding: Uint8Array;
    reserved: Uint8Array;
}

export interface UserAccount {
    address: Address;
    data: UserAccountData;
}

const UserAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'owner',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'referrer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['referralCount', getU64Codec()],
    ['offerCount', getU64Codec()],
    ['totalLenderLoans', getU64Codec()],
    ['totalBorrowerLoans', getU64Codec()],
    ['totalLenderLiquidations', getU64Codec()],
    ['totalBorrowerLiquidations', getU64Codec()],
    ['updatedAt', getU64Codec()],
    ['createdAt', getU64Codec()],
    ['bump', getU8Codec()],
    ['padding', fixCodecSize(getBytesCodec(), 7)],
    ['reserved', fixCodecSize(getBytesCodec(), 64)],
]);

export function deserializeUserAccount(data: Uint8Array): UserAccountData {
    const deserialized = UserAccountDataCodec.decode(data);
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
