import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type UserSupplyPositionAccountData = {
    protocol: Address;
    mint: Address;
    withInterest: number;
    amount: bigint;
    withdrawalLimit: bigint;
    decayAmount: bigint;
    lastUpdate: bigint;
    expandPct: number;
    expandDuration: number;
    decayDuration: number;
    baseWithdrawalLimit: bigint;
    status: number;
};

export interface UserSupplyPositionAccount {
    address: Address;
    data: UserSupplyPositionAccountData;
}

function getUserSupplyPositionAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    protocol: Address;
    mint: Address;
    withInterest: number;
    amount: bigint;
    withdrawalLimit: bigint;
    decayAmount: bigint;
    lastUpdate: bigint;
    expandPct: number;
    expandDuration: number;
    decayDuration: number;
    baseWithdrawalLimit: bigint;
    status: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['withInterest', getU8Decoder()],
        ['amount', getU64Decoder()],
        ['withdrawalLimit', getU64Decoder()],
        ['decayAmount', getU64Decoder()],
        ['lastUpdate', getU64Decoder()],
        ['expandPct', getU16Decoder()],
        ['expandDuration', getU32Decoder()],
        ['decayDuration', getU32Decoder()],
        ['baseWithdrawalLimit', getU64Decoder()],
        ['status', getU8Decoder()],
    ]);
}

export function deserializeUserSupplyPositionAccount(data: Uint8Array): UserSupplyPositionAccountData {
    const deserialized = getUserSupplyPositionAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as UserSupplyPositionAccountData;
}

export async function fetchUserSupplyPositionAccount(
    connection: Connection,
    address: Address,
): Promise<UserSupplyPositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('UserSupplyPosition account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeUserSupplyPositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeUserSupplyPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(UserSupplyPositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeUserSupplyPositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllUserSupplyPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<UserSupplyPositionAccount[]> {
    const maybeAccounts = await fetchAllMaybeUserSupplyPositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('UserSupplyPosition account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is UserSupplyPositionAccount => a !== null);
}

export async function fetchProgramAccountsUserSupplyPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<UserSupplyPositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'avyPzzqH6Lq' } }, { dataSize: 124 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeUserSupplyPositionAccount(account.data),
    }));
}
