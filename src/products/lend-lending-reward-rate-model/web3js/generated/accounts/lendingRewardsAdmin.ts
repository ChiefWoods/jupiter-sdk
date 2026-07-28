import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type LendingRewardsAdminAccountData = {
    authority: Address;
    lendingProgram: Address;
    auths: Array<Address>;
    bump: number;
};

export interface LendingRewardsAdminAccount {
    address: Address;
    data: LendingRewardsAdminAccountData;
}

function getLendingRewardsAdminAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    lendingProgram: Address;
    auths: Array<Address>;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['lendingProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        [
            'auths',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeLendingRewardsAdminAccount(data: Uint8Array): LendingRewardsAdminAccountData {
    const deserialized = getLendingRewardsAdminAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as LendingRewardsAdminAccountData;
}

export async function fetchLendingRewardsAdminAccount(
    connection: Connection,
    address: Address,
): Promise<LendingRewardsAdminAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('LendingRewardsAdmin account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeLendingRewardsAdminAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeLendingRewardsAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(LendingRewardsAdminAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeLendingRewardsAdminAccount(accountInfo.data),
        };
    });
}

export async function fetchAllLendingRewardsAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<LendingRewardsAdminAccount[]> {
    const maybeAccounts = await fetchAllMaybeLendingRewardsAdminAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('LendingRewardsAdmin account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is LendingRewardsAdminAccount => a !== null);
}

export async function fetchProgramAccountsLendingRewardsAdmin(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<LendingRewardsAdminAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'CPPEum6SdEk' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeLendingRewardsAdminAccount(account.data),
    }));
}
