import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getU8Decoder,
    getUtf8Decoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const MARKET_RESULT_ACCOUNT_DISCRIMINATOR = new Uint8Array([228, 116, 192, 234, 125, 54, 69, 142]);

export type MarketResultAccountData = {
    marketId: string;
    /**
     * Outcome code: 0 = No, 1 = Yes, 2 = Split (50/50), 3 = Refund (per-position cost basis)
     * Replaces the old `is_yes: bool` — binary compatible (false=0, true=1)
     */
    outcome: number;
    /** Unix timestamp after which claims are permitted */
    settlementTime: bigint;
    /** Whether claims are currently enabled for this market */
    claimsEnabled: boolean;
    createdAt: bigint;
    bump: number;
};

export interface MarketResultAccount {
    address: Address;
    data: MarketResultAccountData;
}

function getMarketResultAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    marketId: string;
    /**
     * Outcome code: 0 = No, 1 = Yes, 2 = Split (50/50), 3 = Refund (per-position cost basis)
     * Replaces the old `is_yes: bool` — binary compatible (false=0, true=1)
     */
    outcome: number;
    /** Unix timestamp after which claims are permitted */
    settlementTime: bigint;
    /** Whether claims are currently enabled for this market */
    claimsEnabled: boolean;
    createdAt: bigint;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['outcome', getU8Decoder()],
        ['settlementTime', getI64Decoder()],
        ['claimsEnabled', getBooleanDecoder()],
        ['createdAt', getI64Decoder()],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeMarketResultAccount(data: Uint8Array): MarketResultAccountData {
    if (!MARKET_RESULT_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('MARKETRESULTACCOUNT discriminator mismatch');
    }
    const deserialized = getMarketResultAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as MarketResultAccountData;
}

export async function fetchMarketResultAccount(connection: Connection, address: Address): Promise<MarketResultAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('MarketResult account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeMarketResultAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeMarketResultAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(MarketResultAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeMarketResultAccount(accountInfo.data),
        };
    });
}

export async function fetchAllMarketResultAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<MarketResultAccount[]> {
    const maybeAccounts = await fetchAllMaybeMarketResultAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('MarketResult account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is MarketResultAccount => a !== null);
}

export async function fetchProgramAccountsMarketResult(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<MarketResultAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'fDJyys8BJ53' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeMarketResultAccount(account.data),
    }));
}
