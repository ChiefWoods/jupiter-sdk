import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { UserClass, userClassCodec } from '../types/userClass';
import { fixCodecSize, getArrayCodec, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface AuthorizationListAccountData {
    authUsers: Array<Address>;
    guardians: Array<Address>;
    userClasses: Array<UserClass>;
}

export interface AuthorizationListAccount {
    address: Address;
    data: AuthorizationListAccountData;
}

const AuthorizationListAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'authUsers',
        getArrayCodec(
            transformCodec(
                fixCodecSize(getBytesCodec(), 32),
                (value: Address) => value.toBytes(),
                value => new Address(value),
            ),
        ),
    ],
    [
        'guardians',
        getArrayCodec(
            transformCodec(
                fixCodecSize(getBytesCodec(), 32),
                (value: Address) => value.toBytes(),
                value => new Address(value),
            ),
        ),
    ],
    ['userClasses', getArrayCodec(userClassCodec)],
]);

export function deserializeAuthorizationListAccount(data: Uint8Array): AuthorizationListAccountData {
    const deserialized = AuthorizationListAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as AuthorizationListAccountData;
}

export async function fetchAuthorizationListAccount(
    connection: Connection,
    address: Address,
): Promise<AuthorizationListAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('AuthorizationList account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeAuthorizationListAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeAuthorizationListAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(AuthorizationListAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeAuthorizationListAccount(accountInfo.data),
        };
    });
}

export async function fetchAllAuthorizationListAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<AuthorizationListAccount[]> {
    const maybeAccounts = await fetchAllMaybeAuthorizationListAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('AuthorizationList account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is AuthorizationListAccount => a !== null);
}

export async function fetchProgramAccountsAuthorizationList(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<AuthorizationListAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '4HHs4AdrB7z' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeAuthorizationListAccount(account.data),
    }));
}
