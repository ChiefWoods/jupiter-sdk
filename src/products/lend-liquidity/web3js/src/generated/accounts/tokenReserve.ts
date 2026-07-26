import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, getU64Codec, transformCodec } from '@solana/codecs';

export interface TokenReserveAccountData {
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
}

export interface TokenReserveAccount {
    address: Address;
    data: TokenReserveAccountData;
}

const TokenReserveAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'vault',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['borrowRate', getU16Codec()],
    ['feeOnInterest', getU16Codec()],
    ['lastUtilization', getU16Codec()],
    ['lastUpdateTimestamp', getU64Codec()],
    ['supplyExchangePrice', getU64Codec()],
    ['borrowExchangePrice', getU64Codec()],
    ['maxUtilization', getU16Codec()],
    ['totalSupplyWithInterest', getU64Codec()],
    ['totalSupplyInterestFree', getU64Codec()],
    ['totalBorrowWithInterest', getU64Codec()],
    ['totalBorrowInterestFree', getU64Codec()],
    ['totalClaimAmount', getU64Codec()],
    [
        'interactingProtocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['interactingTimestamp', getU64Codec()],
    ['interactingBalance', getU64Codec()],
]);

export function deserializeTokenReserveAccount(data: Uint8Array): TokenReserveAccountData {
    const deserialized = TokenReserveAccountDataCodec.decode(data);
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
