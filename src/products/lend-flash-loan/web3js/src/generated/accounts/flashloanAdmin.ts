import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface FlashloanAdminAccountData {
    authority: Address;
    liquidityProgram: Address;
    status: boolean;
    flashloanFee: number;
    flashloanTimestamp: bigint;
    isFlashloanActive: boolean;
    activeFlashloanAmount: bigint;
    bump: number;
}

export interface FlashloanAdminAccount {
    address: Address;
    data: FlashloanAdminAccountData;
}

const FlashloanAdminAccountDataCodec = getStructCodec([
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
        'liquidityProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['status', getBooleanCodec()],
    ['flashloanFee', getU16Codec()],
    ['flashloanTimestamp', getU64Codec()],
    ['isFlashloanActive', getBooleanCodec()],
    ['activeFlashloanAmount', getU64Codec()],
    ['bump', getU8Codec()],
]);

export function deserializeFlashloanAdminAccount(data: Uint8Array): FlashloanAdminAccountData {
    const deserialized = FlashloanAdminAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as FlashloanAdminAccountData;
}

export async function fetchFlashloanAdminAccount(
    connection: Connection,
    address: Address,
): Promise<FlashloanAdminAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('FlashloanAdmin account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeFlashloanAdminAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeFlashloanAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(FlashloanAdminAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeFlashloanAdminAccount(accountInfo.data),
        };
    });
}

export async function fetchAllFlashloanAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<FlashloanAdminAccount[]> {
    const maybeAccounts = await fetchAllMaybeFlashloanAdminAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('FlashloanAdmin account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is FlashloanAdminAccount => a !== null);
}

export async function fetchProgramAccountsFlashloanAdmin(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<FlashloanAdminAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'UCiE5pJ2dvo' } }, { dataSize: 93 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeFlashloanAdminAccount(account.data),
    }));
}
