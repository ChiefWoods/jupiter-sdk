import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR = new Uint8Array([21, 18, 59, 135, 120, 20, 31, 12]);

export type TokenReserveAccountData = {
    mint: Address;
    vault: Address;
    borrowRate: number;
    feeOnInterest: number;
    lastUtilization: number;
    lastUpdateTimestamp: bigint;
    supplyExchangePrice: bigint;
    borrowExchangePrice: bigint;
    maxUtilization: number;
    totalSupplyWithInterest: bigint;
    totalSupplyInterestFree: bigint;
    totalBorrowWithInterest: bigint;
    totalBorrowInterestFree: bigint;
    totalClaimAmount: bigint;
    interactingProtocol: Address;
    interactingTimestamp: bigint;
    interactingBalance: bigint;
};

export interface TokenReserveAccount {
    address: Address;
    data: TokenReserveAccountData;
}

function getTokenReserveAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    mint: Address;
    vault: Address;
    borrowRate: number;
    feeOnInterest: number;
    lastUtilization: number;
    lastUpdateTimestamp: bigint;
    supplyExchangePrice: bigint;
    borrowExchangePrice: bigint;
    maxUtilization: number;
    totalSupplyWithInterest: bigint;
    totalSupplyInterestFree: bigint;
    totalBorrowWithInterest: bigint;
    totalBorrowInterestFree: bigint;
    totalClaimAmount: bigint;
    interactingProtocol: Address;
    interactingTimestamp: bigint;
    interactingBalance: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['vault', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrowRate', getU16Decoder()],
        ['feeOnInterest', getU16Decoder()],
        ['lastUtilization', getU16Decoder()],
        ['lastUpdateTimestamp', getU64Decoder()],
        ['supplyExchangePrice', getU64Decoder()],
        ['borrowExchangePrice', getU64Decoder()],
        ['maxUtilization', getU16Decoder()],
        ['totalSupplyWithInterest', getU64Decoder()],
        ['totalSupplyInterestFree', getU64Decoder()],
        ['totalBorrowWithInterest', getU64Decoder()],
        ['totalBorrowInterestFree', getU64Decoder()],
        ['totalClaimAmount', getU64Decoder()],
        ['interactingProtocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['interactingTimestamp', getU64Decoder()],
        ['interactingBalance', getU64Decoder()],
    ]);
}

export function deserializeTokenReserveAccount(data: Uint8Array): TokenReserveAccountData {
    if (!TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('TokenReserveAccount discriminator mismatch');
    }
    const deserialized = getTokenReserveAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as TokenReserveAccountData;
}

export async function fetchTokenReserveAccount(connection: Connection, address: Address): Promise<TokenReserveAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('TokenReserve account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeTokenReserveAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeTokenReserveAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(TokenReserveAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeTokenReserveAccount(accountInfo.data),
        };
    });
}

export async function fetchAllTokenReserveAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<TokenReserveAccount[]> {
    const maybeAccounts = await fetchAllMaybeTokenReserveAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('TokenReserve account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is TokenReserveAccount => a !== null);
}

export async function fetchProgramAccountsTokenReserve(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<TokenReserveAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '4XRCaxYacbu' } }, { dataSize: 192 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeTokenReserveAccount(account.data),
    }));
}
