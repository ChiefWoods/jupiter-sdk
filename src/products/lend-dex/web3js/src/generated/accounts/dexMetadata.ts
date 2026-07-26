import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, transformCodec } from '@solana/codecs';

export interface DexMetadataAccountData {
    dexId: number;
    lookupTable: Address;
    reserved: Uint8Array;
}

export interface DexMetadataAccount {
    address: Address;
    data: DexMetadataAccountData;
}

const DexMetadataAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['dexId', getU16Codec()],
    [
        'lookupTable',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved', fixCodecSize(getBytesCodec(), 32)],
]);

export function deserializeDexMetadataAccount(data: Uint8Array): DexMetadataAccountData {
    const deserialized = DexMetadataAccountDataCodec.decode(data);
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
