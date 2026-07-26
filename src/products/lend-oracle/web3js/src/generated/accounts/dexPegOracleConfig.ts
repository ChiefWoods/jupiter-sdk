import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { DexPegOracleKind, dexPegOracleKindCodec } from '../types/dexPegOracleKind';
import { Sources, sourcesCodec } from '../types/sources';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU128Codec,
    getU16Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface DexPegOracleConfigAccountData {
    nonce: number;
    dex: Address;
    positionToken0: Address;
    positionToken1: Address;
    tokenReserve0: Address;
    tokenReserve1: Address;
    quoteInToken0: boolean;
    conversionSource: Sources;
    pegBufferPercent: bigint;
    kind: DexPegOracleKind;
    bump: number;
    reserved: Uint8Array;
}

export interface DexPegOracleConfigAccount {
    address: Address;
    data: DexPegOracleConfigAccountData;
}

const DexPegOracleConfigAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['nonce', getU16Codec()],
    [
        'dex',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'positionToken0',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'positionToken1',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'tokenReserve0',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'tokenReserve1',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['quoteInToken0', getBooleanCodec()],
    ['conversionSource', sourcesCodec],
    ['pegBufferPercent', getU128Codec()],
    ['kind', dexPegOracleKindCodec],
    ['bump', getU8Codec()],
    ['reserved', fixCodecSize(getBytesCodec(), 32)],
]);

export function deserializeDexPegOracleConfigAccount(data: Uint8Array): DexPegOracleConfigAccountData {
    const deserialized = DexPegOracleConfigAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as DexPegOracleConfigAccountData;
}

export async function fetchDexPegOracleConfigAccount(
    connection: Connection,
    address: Address,
): Promise<DexPegOracleConfigAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('DexPegOracleConfig account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeDexPegOracleConfigAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeDexPegOracleConfigAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(DexPegOracleConfigAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeDexPegOracleConfigAccount(accountInfo.data),
        };
    });
}

export async function fetchAllDexPegOracleConfigAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<DexPegOracleConfigAccount[]> {
    const maybeAccounts = await fetchAllMaybeDexPegOracleConfigAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('DexPegOracleConfig account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is DexPegOracleConfigAccount => a !== null);
}

export async function fetchProgramAccountsDexPegOracleConfig(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<DexPegOracleConfigAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'AzYxELTutD5' } }, { dataSize: 287 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeDexPegOracleConfigAccount(account.data),
    }));
}
