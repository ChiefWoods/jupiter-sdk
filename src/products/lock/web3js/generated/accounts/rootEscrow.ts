import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU128Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const ROOT_ESCROW_ACCOUNT_DISCRIMINATOR = new Uint8Array([253, 209, 220, 107, 206, 191, 71, 158]);

export type RootEscrowAccountData = {
    /** token mint */
    tokenMint: Address;
    /** creator of the escrow */
    creator: Address;
    /** escrow base key */
    base: Address;
    /** 256 bit merkle root */
    root: ReadonlyUint8Array;
    /** bump */
    bump: number;
    /** token program flag */
    tokenProgramFlag: number;
    /** padding */
    padding0: ReadonlyUint8Array;
    /** max claim amount */
    maxClaimAmount: bigint;
    /** max escrow */
    maxEscrow: bigint;
    /** total funded amount */
    totalFundedAmount: bigint;
    /** total escrow created */
    totalEscrowCreated: bigint;
    /** total distributed amount */
    totalDistributeAmount: bigint;
    /** version */
    version: bigint;
    /** padding */
    padding: bigint;
    /** buffer */
    buffer: Array<bigint>;
};

export interface RootEscrowAccount {
    address: Address;
    data: RootEscrowAccountData;
}

function getRootEscrowAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** token mint */
    tokenMint: Address;
    /** creator of the escrow */
    creator: Address;
    /** escrow base key */
    base: Address;
    /** 256 bit merkle root */
    root: ReadonlyUint8Array;
    /** bump */
    bump: number;
    /** token program flag */
    tokenProgramFlag: number;
    /** padding */
    padding0: ReadonlyUint8Array;
    /** max claim amount */
    maxClaimAmount: bigint;
    /** max escrow */
    maxEscrow: bigint;
    /** total funded amount */
    totalFundedAmount: bigint;
    /** total escrow created */
    totalEscrowCreated: bigint;
    /** total distributed amount */
    totalDistributeAmount: bigint;
    /** version */
    version: bigint;
    /** padding */
    padding: bigint;
    /** buffer */
    buffer: Array<bigint>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['tokenMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['root', fixDecoderSize(getBytesDecoder(), 32)],
        ['bump', getU8Decoder()],
        ['tokenProgramFlag', getU8Decoder()],
        ['padding0', fixDecoderSize(getBytesDecoder(), 6)],
        ['maxClaimAmount', getU64Decoder()],
        ['maxEscrow', getU64Decoder()],
        ['totalFundedAmount', getU64Decoder()],
        ['totalEscrowCreated', getU64Decoder()],
        ['totalDistributeAmount', getU64Decoder()],
        ['version', getU64Decoder()],
        ['padding', getU64Decoder()],
        ['buffer', getArrayDecoder(getU128Decoder(), { size: 5 })],
    ]);
}

export function deserializeRootEscrowAccount(data: Uint8Array): RootEscrowAccountData {
    if (!ROOT_ESCROW_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ROOTESCROWACCOUNT discriminator mismatch');
    }
    const deserialized = getRootEscrowAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as RootEscrowAccountData;
}

export async function fetchRootEscrowAccount(connection: Connection, address: Address): Promise<RootEscrowAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('RootEscrow account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeRootEscrowAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeRootEscrowAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(RootEscrowAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeRootEscrowAccount(accountInfo.data),
        };
    });
}

export async function fetchAllRootEscrowAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<RootEscrowAccount[]> {
    const maybeAccounts = await fetchAllMaybeRootEscrowAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('RootEscrow account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is RootEscrowAccount => a !== null);
}

export async function fetchProgramAccountsRootEscrow(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<RootEscrowAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'jTNSiQ7t6eH' } }, { dataSize: 280 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeRootEscrowAccount(account.data),
    }));
}
