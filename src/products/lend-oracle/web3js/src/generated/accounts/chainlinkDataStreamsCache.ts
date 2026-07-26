import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { ChainlinkDsCacheGenericData, chainlinkDsCacheGenericDataCodec } from '../types/chainlinkDsCacheGenericData';
import { FeedEntry, feedEntryCodec } from '../types/feedEntry';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU128Codec,
    getU16Codec,
    getU64Codec,
    transformCodec,
} from '@solana/codecs';

export interface ChainlinkDataStreamsCacheAccountData {
    nonce: number;
    feeds: Array<FeedEntry>;
    price: bigint;
    lastUpdateTimestampPrice: bigint;
    lastUpdateTimestampMultiplier: bigint;
    lastObservationsTimestamp: bigint;
    genericData: ChainlinkDsCacheGenericData;
    keepers: Array<Address>;
}

export interface ChainlinkDataStreamsCacheAccount {
    address: Address;
    data: ChainlinkDataStreamsCacheAccountData;
}

const ChainlinkDataStreamsCacheAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['nonce', getU16Codec()],
    ['feeds', getArrayCodec(feedEntryCodec)],
    ['price', getU128Codec()],
    ['lastUpdateTimestampPrice', getU64Codec()],
    ['lastUpdateTimestampMultiplier', getU64Codec()],
    ['lastObservationsTimestamp', getU64Codec()],
    ['genericData', chainlinkDsCacheGenericDataCodec],
    [
        'keepers',
        getArrayCodec(
            transformCodec(
                fixCodecSize(getBytesCodec(), 32),
                (value: Address) => value.toBytes(),
                value => new Address(value),
            ),
        ),
    ],
]);

export function deserializeChainlinkDataStreamsCacheAccount(data: Uint8Array): ChainlinkDataStreamsCacheAccountData {
    const deserialized = ChainlinkDataStreamsCacheAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as ChainlinkDataStreamsCacheAccountData;
}

export async function fetchChainlinkDataStreamsCacheAccount(
    connection: Connection,
    address: Address,
): Promise<ChainlinkDataStreamsCacheAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('ChainlinkDataStreamsCache account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeChainlinkDataStreamsCacheAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeChainlinkDataStreamsCacheAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(ChainlinkDataStreamsCacheAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeChainlinkDataStreamsCacheAccount(accountInfo.data),
        };
    });
}

export async function fetchAllChainlinkDataStreamsCacheAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<ChainlinkDataStreamsCacheAccount[]> {
    const maybeAccounts = await fetchAllMaybeChainlinkDataStreamsCacheAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('ChainlinkDataStreamsCache account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is ChainlinkDataStreamsCacheAccount => a !== null);
}

export async function fetchProgramAccountsChainlinkDataStreamsCache(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<ChainlinkDataStreamsCacheAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'BwTZMkn9U5W' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeChainlinkDataStreamsCacheAccount(account.data),
    }));
}
