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

export type LendingAdminAccountData = {
    authority: Address;
    liquidityProgram: Address;
    rebalancer: Address;
    nextLendingId: number;
    auths: Array<Address>;
    bump: number;
};

export interface LendingAdminAccount {
    address: Address;
    data: LendingAdminAccountData;
}

function getLendingAdminAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    liquidityProgram: Address;
    rebalancer: Address;
    nextLendingId: number;
    auths: Array<Address>;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['rebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['nextLendingId', getU16Decoder()],
        [
            'auths',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeLendingAdminAccount(data: Uint8Array): LendingAdminAccountData {
    const deserialized = getLendingAdminAccountDataDecoder().decode(data);
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
