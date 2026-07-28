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

export type DexPositionAccountData = {
    dexId: number;
    protocol: Address;
    supplyStatus: number;
    supplyShares: bigint;
    withdrawalLimit: bigint;
    supplyLastUpdate: bigint;
    supplyExpandPct: number;
    supplyExpandDuration: bigint;
    baseWithdrawalLimit: bigint;
    borrowStatus: number;
    borrowShares: bigint;
    debtCeiling: bigint;
    borrowLastUpdate: bigint;
    borrowExpandPct: number;
    borrowExpandDuration: number;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
    reserved: ReadonlyUint8Array;
};

export interface DexPositionAccount {
    address: Address;
    data: DexPositionAccountData;
}

function getDexPositionAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    dexId: number;
    protocol: Address;
    supplyStatus: number;
    supplyShares: bigint;
    withdrawalLimit: bigint;
    supplyLastUpdate: bigint;
    supplyExpandPct: number;
    supplyExpandDuration: bigint;
    baseWithdrawalLimit: bigint;
    borrowStatus: number;
    borrowShares: bigint;
    debtCeiling: bigint;
    borrowLastUpdate: bigint;
    borrowExpandPct: number;
    borrowExpandDuration: number;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['dexId', getU16Decoder()],
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyStatus', getU8Decoder()],
        ['supplyShares', getU64Decoder()],
        ['withdrawalLimit', getU64Decoder()],
        ['supplyLastUpdate', getU64Decoder()],
        ['supplyExpandPct', getU16Decoder()],
        ['supplyExpandDuration', getU64Decoder()],
        ['baseWithdrawalLimit', getU64Decoder()],
        ['borrowStatus', getU8Decoder()],
        ['borrowShares', getU64Decoder()],
        ['debtCeiling', getU64Decoder()],
        ['borrowLastUpdate', getU64Decoder()],
        ['borrowExpandPct', getU16Decoder()],
        ['borrowExpandDuration', getU32Decoder()],
        ['baseDebtCeiling', getU64Decoder()],
        ['maxDebtCeiling', getU64Decoder()],
        ['reserved', fixDecoderSize(getBytesDecoder(), 32)],
    ]);
}

export function deserializeDexPositionAccount(data: Uint8Array): DexPositionAccountData {
    const deserialized = getDexPositionAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as DexPositionAccountData;
}

export async function fetchDexPositionAccount(connection: Connection, address: Address): Promise<DexPositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('DexPosition account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeDexPositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeDexPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(DexPositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeDexPositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllDexPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<DexPositionAccount[]> {
    const maybeAccounts = await fetchAllMaybeDexPositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('DexPosition account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is DexPositionAccount => a !== null);
}

export async function fetchProgramAccountsDexPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<DexPositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '63SBvf9Agpe' } }, { dataSize: 164 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeDexPositionAccount(account.data),
    }));
}
