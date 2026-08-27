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

export const ORACLE_ADMIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([239, 232, 8, 20, 254, 63, 25, 246]);

export type OracleAdminAccountData = { authority: Address; auths: Array<Address> };

export interface OracleAdminAccount {
    address: Address;
    data: OracleAdminAccountData;
}

function getOracleAdminAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    auths: Array<Address>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        [
            'auths',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
    ]);
}

export function deserializeOracleAdminAccount(data: Uint8Array): OracleAdminAccountData {
    if (!ORACLE_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OracleAdminAccount discriminator mismatch');
    }
    const deserialized = getOracleAdminAccountDataDecoder().decode(data);
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
