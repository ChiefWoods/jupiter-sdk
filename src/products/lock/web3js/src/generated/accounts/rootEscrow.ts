import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU128Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface RootEscrowAccountData {
    tokenMint: Address;
    creator: Address;
    base: Address;
    root: Uint8Array;
    bump: number;
    tokenProgramFlag: number;
    padding0: Uint8Array;
    maxClaimAmount: bigint;
    maxEscrow: bigint;
    totalFundedAmount: bigint;
    totalEscrowCreated: bigint;
    totalDistributeAmount: bigint;
    version: bigint;
    padding: bigint;
    buffer: Array<bigint>;
}

export interface RootEscrowAccount {
    address: Address;
    data: RootEscrowAccountData;
}

const RootEscrowAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'tokenMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'base',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['root', fixCodecSize(getBytesCodec(), 32)],
    ['bump', getU8Codec()],
    ['tokenProgramFlag', getU8Codec()],
    ['padding0', fixCodecSize(getBytesCodec(), 6)],
    ['maxClaimAmount', getU64Codec()],
    ['maxEscrow', getU64Codec()],
    ['totalFundedAmount', getU64Codec()],
    ['totalEscrowCreated', getU64Codec()],
    ['totalDistributeAmount', getU64Codec()],
    ['version', getU64Codec()],
    ['padding', getU64Codec()],
    ['buffer', getArrayCodec(getU128Codec(), { size: 5 })],
]);

export function deserializeRootEscrowAccount(data: Uint8Array): RootEscrowAccountData {
    const deserialized = RootEscrowAccountDataCodec.decode(data);
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
