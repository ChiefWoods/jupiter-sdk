import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface DexAdminAccountData {
    authority: Address;
    liquidityProgram: Address;
    nextDexId: number;
    auths: Array<Address>;
    guardians: Array<Address>;
    reserved: Uint8Array;
    bump: number;
}

export interface DexAdminAccount {
    address: Address;
    data: DexAdminAccountData;
}

const DexAdminAccountDataCodec = getStructCodec([
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
    ['nextDexId', getU16Codec()],
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
    ['reserved', fixCodecSize(getBytesCodec(), 28)],
    ['bump', getU8Codec()],
]);

export function deserializeDexAdminAccount(data: Uint8Array): DexAdminAccountData {
    const deserialized = DexAdminAccountDataCodec.decode(data);
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
