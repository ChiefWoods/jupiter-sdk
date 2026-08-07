import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU128Decoder,
    getU16Decoder,
    getU64Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getChainlinkDsCacheGenericDataDecoder,
    type ChainlinkDsCacheGenericData,
} from '../types/chainlinkDsCacheGenericData';
import { getFeedEntryDecoder, type FeedEntry } from '../types/feedEntry';

export const CHAINLINK_DATA_STREAMS_CACHE_ACCOUNT_DISCRIMINATOR = new Uint8Array([65, 102, 75, 47, 79, 156, 109, 193]);

export type ChainlinkDataStreamsCacheAccountData = {
    nonce: number;
    feeds: Array<FeedEntry>;
    price: bigint;
    lastUpdateTimestampPrice: bigint;
    lastUpdateTimestampMultiplier: bigint;
    lastObservationsTimestamp: bigint;
    genericData: ChainlinkDsCacheGenericData;
    keepers: Array<Address>;
};

export interface ChainlinkDataStreamsCacheAccount {
    address: Address;
    data: ChainlinkDataStreamsCacheAccountData;
}

function getChainlinkDataStreamsCacheAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    nonce: number;
    feeds: Array<FeedEntry>;
    price: bigint;
    lastUpdateTimestampPrice: bigint;
    lastUpdateTimestampMultiplier: bigint;
    lastObservationsTimestamp: bigint;
    genericData: ChainlinkDsCacheGenericData;
    keepers: Array<Address>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['nonce', getU16Decoder()],
        ['feeds', getArrayDecoder(getFeedEntryDecoder())],
        ['price', getU128Decoder()],
        ['lastUpdateTimestampPrice', getU64Decoder()],
        ['lastUpdateTimestampMultiplier', getU64Decoder()],
        ['lastObservationsTimestamp', getU64Decoder()],
        ['genericData', getChainlinkDsCacheGenericDataDecoder()],
        [
            'keepers',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
    ]);
}

export function deserializeChainlinkDataStreamsCacheAccount(data: Uint8Array): ChainlinkDataStreamsCacheAccountData {
    if (!CHAINLINK_DATA_STREAMS_CACHE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CHAINLINKDATASTREAMSCACHEACCOUNT discriminator mismatch');
    }
    const deserialized = getChainlinkDataStreamsCacheAccountDataDecoder().decode(data);
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
