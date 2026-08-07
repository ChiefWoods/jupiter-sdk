import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const FLASHLOAN_ADMIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([162, 161, 45, 28, 131, 91, 202, 88]);

export type FlashloanAdminAccountData = {
    authority: Address;
    liquidityProgram: Address;
    status: boolean;
    flashloanFee: number;
    flashloanTimestamp: bigint;
    isFlashloanActive: boolean;
    activeFlashloanAmount: bigint;
    bump: number;
};

export interface FlashloanAdminAccount {
    address: Address;
    data: FlashloanAdminAccountData;
}

function getFlashloanAdminAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    liquidityProgram: Address;
    status: boolean;
    flashloanFee: number;
    flashloanTimestamp: bigint;
    isFlashloanActive: boolean;
    activeFlashloanAmount: bigint;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['status', getBooleanDecoder()],
        ['flashloanFee', getU16Decoder()],
        ['flashloanTimestamp', getU64Decoder()],
        ['isFlashloanActive', getBooleanDecoder()],
        ['activeFlashloanAmount', getU64Decoder()],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeFlashloanAdminAccount(data: Uint8Array): FlashloanAdminAccountData {
    if (!FLASHLOAN_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('FLASHLOANADMINACCOUNT discriminator mismatch');
    }
    const deserialized = getFlashloanAdminAccountDataDecoder().decode(data);
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
