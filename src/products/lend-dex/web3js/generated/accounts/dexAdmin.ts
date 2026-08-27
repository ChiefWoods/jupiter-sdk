import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const DEX_ADMIN_ACCOUNT_DISCRIMINATOR = new Uint8Array([82, 155, 122, 221, 230, 96, 118, 155]);

export type DexAdminAccountData = {
    authority: Address;
    liquidityProgram: Address;
    nextDexId: number;
    auths: Array<Address>;
    /** Guardians can pause a dex; unpause remains auth-only. */
    guardians: Array<Address>;
    reserved: ReadonlyUint8Array;
    bump: number;
};

export interface DexAdminAccount {
    address: Address;
    data: DexAdminAccountData;
}

function getDexAdminAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    liquidityProgram: Address;
    nextDexId: number;
    auths: Array<Address>;
    /** Guardians can pause a dex; unpause remains auth-only. */
    guardians: Array<Address>;
    reserved: ReadonlyUint8Array;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['nextDexId', getU16Decoder()],
        [
            'auths',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        [
            'guardians',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['reserved', fixDecoderSize(getBytesDecoder(), 28)],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeDexAdminAccount(data: Uint8Array): DexAdminAccountData {
    if (!DEX_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('DexAdminAccount discriminator mismatch');
    }
    const deserialized = getDexAdminAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as DexAdminAccountData;
}

export async function fetchDexAdminAccount(connection: Connection, address: Address): Promise<DexAdminAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('DexAdmin account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeDexAdminAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeDexAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(DexAdminAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeDexAdminAccount(accountInfo.data),
        };
    });
}

export async function fetchAllDexAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<DexAdminAccount[]> {
    const maybeAccounts = await fetchAllMaybeDexAdminAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('DexAdmin account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is DexAdminAccount => a !== null);
}

export async function fetchProgramAccountsDexAdmin(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<DexAdminAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'EpPtomjxujG' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeDexAdminAccount(account.data),
    }));
}
