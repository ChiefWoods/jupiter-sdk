import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type DexMetadataAccountData = { dexId: number; lookupTable: Address; reserved: ReadonlyUint8Array };

export interface DexMetadataAccount {
    address: Address;
    data: DexMetadataAccountData;
}

function getDexMetadataAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    dexId: number;
    lookupTable: Address;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['dexId', getU16Decoder()],
        ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 32)],
    ]);
}

export function deserializeDexMetadataAccount(data: Uint8Array): DexMetadataAccountData {
    const deserialized = getDexMetadataAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as DexMetadataAccountData;
}

export async function fetchDexMetadataAccount(connection: Connection, address: Address): Promise<DexMetadataAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('DexMetadata account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeDexMetadataAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeDexMetadataAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(DexMetadataAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeDexMetadataAccount(accountInfo.data),
        };
    });
}

export async function fetchAllDexMetadataAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<DexMetadataAccount[]> {
    const maybeAccounts = await fetchAllMaybeDexMetadataAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('DexMetadata account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is DexMetadataAccount => a !== null);
}

export async function fetchProgramAccountsDexMetadata(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<DexMetadataAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'WktHLnqzsQY' } }, { dataSize: 74 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeDexMetadataAccount(account.data),
    }));
}
