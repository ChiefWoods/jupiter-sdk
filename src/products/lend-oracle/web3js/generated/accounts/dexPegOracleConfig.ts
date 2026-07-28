import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU128Decoder,
    getU16Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getDexPegOracleKindDecoder, type DexPegOracleKind } from '../types/dexPegOracleKind';
import { getSourcesDecoder, type Sources } from '../types/sources';

export type DexPegOracleConfigAccountData = {
    nonce: number;
    dex: Address;
    positionToken0: Address;
    positionToken1: Address;
    tokenReserve0: Address;
    tokenReserve1: Address;
    /**
     * Which token the combined reserves are denominated in (EVM
     * `QUOTE_IN_TOKEN0`). Irrelevant for pure 1:1 pegs (both orientations sum
     * identically); meaningful once a [`Self::conversion_source`] is set.
     */
    quoteInToken0: boolean;
    /**
     * Optional reserves-conversion price source (EVM
     * `RESERVES_CONVERSION_ORACLE`), needed for non-1:1 pools like LST/SOL:
     * prices ONE unit of token0 in token1 units (1e15-scaled after the
     * entry's own `invert`). `source == Pubkey::default()` → hard 1:1 peg
     * (USDC/USDT style), no extra account.
     * Restricted to single-account source types (Pyth, StakePool, MsolPool,
     * Redstone, Chainlink, ChainlinkDataStreams).
     */
    conversionSource: Sources;
    pegBufferPercent: bigint;
    kind: DexPegOracleKind;
    bump: number;
    reserved: ReadonlyUint8Array;
};

export interface DexPegOracleConfigAccount {
    address: Address;
    data: DexPegOracleConfigAccountData;
}

function getDexPegOracleConfigAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    nonce: number;
    dex: Address;
    positionToken0: Address;
    positionToken1: Address;
    tokenReserve0: Address;
    tokenReserve1: Address;
    /**
     * Which token the combined reserves are denominated in (EVM
     * `QUOTE_IN_TOKEN0`). Irrelevant for pure 1:1 pegs (both orientations sum
     * identically); meaningful once a [`Self::conversion_source`] is set.
     */
    quoteInToken0: boolean;
    /**
     * Optional reserves-conversion price source (EVM
     * `RESERVES_CONVERSION_ORACLE`), needed for non-1:1 pools like LST/SOL:
     * prices ONE unit of token0 in token1 units (1e15-scaled after the
     * entry's own `invert`). `source == Pubkey::default()` → hard 1:1 peg
     * (USDC/USDT style), no extra account.
     * Restricted to single-account source types (Pyth, StakePool, MsolPool,
     * Redstone, Chainlink, ChainlinkDataStreams).
     */
    conversionSource: Sources;
    pegBufferPercent: bigint;
    kind: DexPegOracleKind;
    bump: number;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['nonce', getU16Decoder()],
        ['dex', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['positionToken0', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['positionToken1', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenReserve0', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenReserve1', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['quoteInToken0', getBooleanDecoder()],
        ['conversionSource', getSourcesDecoder()],
        ['pegBufferPercent', getU128Decoder()],
        ['kind', getDexPegOracleKindDecoder()],
        ['bump', getU8Decoder()],
        ['reserved', fixDecoderSize(getBytesDecoder(), 32)],
    ]);
}

export function deserializeDexPegOracleConfigAccount(data: Uint8Array): DexPegOracleConfigAccountData {
    const deserialized = getDexPegOracleConfigAccountDataDecoder().decode(data);
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
