import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getPermissionsDecoder, type Permissions } from '../types/permissions';

export const PERPETUALS_ACCOUNT_DISCRIMINATOR = new Uint8Array([28, 167, 98, 191, 104, 82, 108, 196]);

export type PerpetualsAccountData = {
    permissions: Permissions;
    pools: Array<Address>;
    admin: Address;
    transferAuthorityBump: number;
    perpetualsBump: number;
    inceptionTime: bigint;
};

export interface PerpetualsAccount {
    address: Address;
    data: PerpetualsAccountData;
}

function getPerpetualsAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    permissions: Permissions;
    pools: Array<Address>;
    admin: Address;
    transferAuthorityBump: number;
    perpetualsBump: number;
    inceptionTime: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['permissions', getPermissionsDecoder()],
        [
            'pools',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['admin', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['transferAuthorityBump', getU8Decoder()],
        ['perpetualsBump', getU8Decoder()],
        ['inceptionTime', getI64Decoder()],
    ]);
}

export function deserializePerpetualsAccount(data: Uint8Array): PerpetualsAccountData {
    if (!PERPETUALS_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PERPETUALSACCOUNT discriminator mismatch');
    }
    const deserialized = getPerpetualsAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as PerpetualsAccountData;
}

export async function fetchPerpetualsAccount(connection: Connection, address: Address): Promise<PerpetualsAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Perpetuals account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializePerpetualsAccount(accountInfo.data),
    };
}

export async function fetchAllMaybePerpetualsAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(PerpetualsAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializePerpetualsAccount(accountInfo.data),
        };
    });
}

export async function fetchAllPerpetualsAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<PerpetualsAccount[]> {
    const maybeAccounts = await fetchAllMaybePerpetualsAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Perpetuals account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is PerpetualsAccount => a !== null);
}

export async function fetchProgramAccountsPerpetuals(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<PerpetualsAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '5nyjp1aZDB1' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePerpetualsAccount(account.data),
    }));
}
