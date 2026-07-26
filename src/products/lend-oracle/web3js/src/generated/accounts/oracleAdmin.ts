import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getArrayCodec, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface OracleAdminAccountData {
    authority: Address;
    auths: Array<Address>;
}

export interface OracleAdminAccount {
    address: Address;
    data: OracleAdminAccountData;
}

const OracleAdminAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'auths',
        getArrayCodec(
            transformCodec(
                fixCodecSize(getBytesCodec(), 32),
                (value: Address) => value.toBytes(),
                value => new Address(value),
            ),
        ),
    ],
]);

export function deserializeOracleAdminAccount(data: Uint8Array): OracleAdminAccountData {
    const deserialized = OracleAdminAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as OracleAdminAccountData;
}

export async function fetchOracleAdminAccount(connection: Connection, address: Address): Promise<OracleAdminAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('OracleAdmin account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeOracleAdminAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeOracleAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(OracleAdminAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeOracleAdminAccount(accountInfo.data),
        };
    });
}

export async function fetchAllOracleAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<OracleAdminAccount[]> {
    const maybeAccounts = await fetchAllMaybeOracleAdminAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('OracleAdmin account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is OracleAdminAccount => a !== null);
}

export async function fetchProgramAccountsOracleAdmin(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<OracleAdminAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'h8PkqGmjXVw' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeOracleAdminAccount(account.data),
    }));
}
