import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getUserClassDecoder, type UserClass } from '../types/userClass';

export const AUTHORIZATION_LIST_ACCOUNT_DISCRIMINATOR = new Uint8Array([19, 157, 117, 43, 236, 167, 251, 69]);

export type AuthorizationListAccountData = {
    authUsers: Array<Address>;
    guardians: Array<Address>;
    userClasses: Array<UserClass>;
};

export interface AuthorizationListAccount {
    address: Address;
    data: AuthorizationListAccountData;
}

function getAuthorizationListAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authUsers: Array<Address>;
    guardians: Array<Address>;
    userClasses: Array<UserClass>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        [
            'authUsers',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        [
            'guardians',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['userClasses', getArrayDecoder(getUserClassDecoder())],
    ]);
}

export function deserializeAuthorizationListAccount(data: Uint8Array): AuthorizationListAccountData {
    if (!AUTHORIZATION_LIST_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('AuthorizationListAccount discriminator mismatch');
    }
    const deserialized = getAuthorizationListAccountDataDecoder().decode(data);
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
