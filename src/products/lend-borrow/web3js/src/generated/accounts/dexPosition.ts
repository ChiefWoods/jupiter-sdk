import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface DexPositionAccountData {
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
    reserved: Uint8Array;
}

export interface DexPositionAccount {
    address: Address;
    data: DexPositionAccountData;
}

const DexPositionAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['dexId', getU16Codec()],
    [
        'protocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['supplyStatus', getU8Codec()],
    ['supplyShares', getU64Codec()],
    ['withdrawalLimit', getU64Codec()],
    ['supplyLastUpdate', getU64Codec()],
    ['supplyExpandPct', getU16Codec()],
    ['supplyExpandDuration', getU64Codec()],
    ['baseWithdrawalLimit', getU64Codec()],
    ['borrowStatus', getU8Codec()],
    ['borrowShares', getU64Codec()],
    ['debtCeiling', getU64Codec()],
    ['borrowLastUpdate', getU64Codec()],
    ['borrowExpandPct', getU16Codec()],
    ['borrowExpandDuration', getU32Codec()],
    ['baseDebtCeiling', getU64Codec()],
    ['maxDebtCeiling', getU64Codec()],
    ['reserved', fixCodecSize(getBytesCodec(), 32)],
]);

export function deserializeDexPositionAccount(data: Uint8Array): DexPositionAccountData {
    const deserialized = DexPositionAccountDataCodec.decode(data);
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
