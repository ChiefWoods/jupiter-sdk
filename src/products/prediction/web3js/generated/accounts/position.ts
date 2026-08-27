import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const POSITION_ACCOUNT_DISCRIMINATOR = new Uint8Array([170, 188, 143, 228, 122, 64, 247, 208]);

export type PositionAccountData = {
    /** Owner of this position */
    owner: Address;
    /** Market ID */
    marketId: string;
    /** Whether this is a YES or NO position */
    isYes: boolean;
    /** Whether payout has been claimed (only relevant after market settlement) */
    payoutClaimed: boolean;
    /** Amount claimed in USD with 6 decimals (for record keeping) */
    payoutClaimedUsd: bigint;
    /** Timestamp when position was opened */
    openedAt: bigint;
    /** Total contracts currently held */
    contracts: bigint;
    /**
     * Total cost basis for all contracts (USD with 6 decimals)
     * This is the sum of all dollars paid for currently held contracts
     */
    totalCostUsd: bigint;
    /** Number of open orders for this position */
    openOrders: number;
    /**
     * Entry fees attached to currently open contracts (USD, 6 decimals).
     * Reduced proportionally on partial sells; included in realized PnL on exit.
     */
    feesPaidUsd: bigint;
    /** Realized PnL from closed positions (USD, can be negative) */
    realizedPnlUsd: bigint;
    /** Timestamp when position was last updated */
    updatedAt: bigint;
    /** PDA bump */
    bump: number;
    /** Contract unit version. 0 = legacy whole contracts, 1 = micro-contracts. */
    unitVersion: number;
    /** Who paid to initialize this position account. */
    payer: Address;
};

export interface PositionAccount {
    address: Address;
    data: PositionAccountData;
}

function getPositionAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** Owner of this position */
    owner: Address;
    /** Market ID */
    marketId: string;
    /** Whether this is a YES or NO position */
    isYes: boolean;
    /** Whether payout has been claimed (only relevant after market settlement) */
    payoutClaimed: boolean;
    /** Amount claimed in USD with 6 decimals (for record keeping) */
    payoutClaimedUsd: bigint;
    /** Timestamp when position was opened */
    openedAt: bigint;
    /** Total contracts currently held */
    contracts: bigint;
    /**
     * Total cost basis for all contracts (USD with 6 decimals)
     * This is the sum of all dollars paid for currently held contracts
     */
    totalCostUsd: bigint;
    /** Number of open orders for this position */
    openOrders: number;
    /**
     * Entry fees attached to currently open contracts (USD, 6 decimals).
     * Reduced proportionally on partial sells; included in realized PnL on exit.
     */
    feesPaidUsd: bigint;
    /** Realized PnL from closed positions (USD, can be negative) */
    realizedPnlUsd: bigint;
    /** Timestamp when position was last updated */
    updatedAt: bigint;
    /** PDA bump */
    bump: number;
    /** Contract unit version. 0 = legacy whole contracts, 1 = micro-contracts. */
    unitVersion: number;
    /** Who paid to initialize this position account. */
    payer: Address;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['isYes', getBooleanDecoder()],
        ['payoutClaimed', getBooleanDecoder()],
        ['payoutClaimedUsd', getU64Decoder()],
        ['openedAt', getI64Decoder()],
        ['contracts', getU64Decoder()],
        ['totalCostUsd', getU64Decoder()],
        ['openOrders', getU32Decoder()],
        ['feesPaidUsd', getU64Decoder()],
        ['realizedPnlUsd', getI64Decoder()],
        ['updatedAt', getI64Decoder()],
        ['bump', getU8Decoder()],
        ['unitVersion', getU8Decoder()],
        ['payer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
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
        filters: [...[{ memcmp: { offset: 0, bytes: 'VZMoMoKgZQb' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePositionAccount(account.data),
    }));
}
