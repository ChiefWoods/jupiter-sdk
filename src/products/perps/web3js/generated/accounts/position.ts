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
import { getSideDecoder, type Side } from '../types/side';

export const POSITION_ACCOUNT_DISCRIMINATOR = new Uint8Array([170, 188, 143, 228, 122, 64, 247, 208]);

export type PositionAccountData = {
    owner: Address;
    pool: Address;
    custody: Address;
    collateralCustody: Address;
    openTime: bigint;
    updateTime: bigint;
    side: Side;
    price: bigint;
    sizeUsd: bigint;
    collateralUsd: bigint;
    realisedPnlUsd: bigint;
    cumulativeInterestSnapshot: bigint;
    lockedAmount: bigint;
    bump: number;
};

export interface PositionAccount {
    address: Address;
    data: PositionAccountData;
}

function getPositionAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    owner: Address;
    pool: Address;
    custody: Address;
    collateralCustody: Address;
    openTime: bigint;
    updateTime: bigint;
    side: Side;
    price: bigint;
    sizeUsd: bigint;
    collateralUsd: bigint;
    realisedPnlUsd: bigint;
    cumulativeInterestSnapshot: bigint;
    lockedAmount: bigint;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['collateralCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['openTime', getI64Decoder()],
        ['updateTime', getI64Decoder()],
        ['side', getSideDecoder()],
        ['price', getU64Decoder()],
        ['sizeUsd', getU64Decoder()],
        ['collateralUsd', getU64Decoder()],
        ['realisedPnlUsd', getI64Decoder()],
        ['cumulativeInterestSnapshot', getU128Decoder()],
        ['lockedAmount', getU64Decoder()],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializePositionAccount(data: Uint8Array): PositionAccountData {
    if (!POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PositionAccount discriminator mismatch');
    }
    const deserialized = getPositionAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as PositionAccountData;
}

export async function fetchPositionAccount(connection: Connection, address: Address): Promise<PositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Position account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializePositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybePositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(PositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializePositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<PositionAccount[]> {
    const maybeAccounts = await fetchAllMaybePositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Position account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is PositionAccount => a !== null);
}

export async function fetchProgramAccountsPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<PositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'VZMoMoKgZQb' } }, { dataSize: 210 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePositionAccount(account.data),
    }));
}
