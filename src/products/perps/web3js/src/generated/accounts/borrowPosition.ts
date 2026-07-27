import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU128Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type BorrowPositionAccountData = {
    owner: Address;
    pool: Address;
    custody: Address;
    openTime: bigint;
    updateTime: bigint;
    borrowSize: bigint;
    cumulativeCompoundedInterestSnapshot: bigint;
    lockedCollateral: bigint;
    bump: number;
    lastBorrowed: bigint;
};

export interface BorrowPositionAccount {
    address: Address;
    data: BorrowPositionAccountData;
}

function getBorrowPositionAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    owner: Address;
    pool: Address;
    custody: Address;
    openTime: bigint;
    updateTime: bigint;
    borrowSize: bigint;
    cumulativeCompoundedInterestSnapshot: bigint;
    lockedCollateral: bigint;
    bump: number;
    lastBorrowed: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['openTime', getI64Decoder()],
        ['updateTime', getI64Decoder()],
        ['borrowSize', getU128Decoder()],
        ['cumulativeCompoundedInterestSnapshot', getU128Decoder()],
        ['lockedCollateral', getU64Decoder()],
        ['bump', getU8Decoder()],
        ['lastBorrowed', getI64Decoder()],
    ]);
}

export function deserializeBorrowPositionAccount(data: Uint8Array): BorrowPositionAccountData {
    const deserialized = getBorrowPositionAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as BorrowPositionAccountData;
}

export async function fetchBorrowPositionAccount(
    connection: Connection,
    address: Address,
): Promise<BorrowPositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('BorrowPosition account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeBorrowPositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeBorrowPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(BorrowPositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeBorrowPositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllBorrowPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<BorrowPositionAccount[]> {
    const maybeAccounts = await fetchAllMaybeBorrowPositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('BorrowPosition account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is BorrowPositionAccount => a !== null);
}

export async function fetchProgramAccountsBorrowPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<BorrowPositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'hjiLtM2oecN' } }, { dataSize: 169 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeBorrowPositionAccount(account.data),
    }));
}
