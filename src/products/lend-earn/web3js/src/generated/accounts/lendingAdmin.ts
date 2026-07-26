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

export interface LendingAdminAccountData {
    authority: Address;
    liquidityProgram: Address;
    rebalancer: Address;
    nextLendingId: number;
    auths: Array<Address>;
    bump: number;
}

export interface LendingAdminAccount {
    address: Address;
    data: LendingAdminAccountData;
}

const LendingAdminAccountDataCodec = getStructCodec([
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
    [
        'rebalancer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['nextLendingId', getU16Codec()],
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
    ['bump', getU8Codec()],
]);

export function deserializeLendingAdminAccount(data: Uint8Array): LendingAdminAccountData {
    const deserialized = LendingAdminAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as LendingAdminAccountData;
}

export async function fetchLendingAdminAccount(connection: Connection, address: Address): Promise<LendingAdminAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('LendingAdmin account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeLendingAdminAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeLendingAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(LendingAdminAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeLendingAdminAccount(accountInfo.data),
        };
    });
}

export async function fetchAllLendingAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<LendingAdminAccount[]> {
    const maybeAccounts = await fetchAllMaybeLendingAdminAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('LendingAdmin account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is LendingAdminAccount => a !== null);
}

export async function fetchProgramAccountsLendingAdmin(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<LendingAdminAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '82m8HsjiQTW' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeLendingAdminAccount(account.data),
    }));
}
