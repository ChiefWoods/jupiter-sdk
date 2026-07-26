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

export interface VestingEscrowAccountData {
    recipient: Address;
    tokenMint: Address;
    creator: Address;
    base: Address;
    escrowBump: number;
    updateRecipientMode: number;
    cancelMode: number;
    tokenProgramFlag: number;
    padding0: Uint8Array;
    cliffTime: bigint;
    frequency: bigint;
    cliffUnlockAmount: bigint;
    amountPerPeriod: bigint;
    numberOfPeriod: bigint;
    totalClaimedAmount: bigint;
    vestingStartTime: bigint;
    cancelledAt: bigint;
    padding1: bigint;
    buffer: Array<bigint>;
}

export interface VestingEscrowAccount {
    address: Address;
    data: VestingEscrowAccountData;
}

const VestingEscrowAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'recipient',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
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
    ['escrowBump', getU8Codec()],
    ['updateRecipientMode', getU8Codec()],
    ['cancelMode', getU8Codec()],
    ['tokenProgramFlag', getU8Codec()],
    ['padding0', fixCodecSize(getBytesCodec(), 4)],
    ['cliffTime', getU64Codec()],
    ['frequency', getU64Codec()],
    ['cliffUnlockAmount', getU64Codec()],
    ['amountPerPeriod', getU64Codec()],
    ['numberOfPeriod', getU64Codec()],
    ['totalClaimedAmount', getU64Codec()],
    ['vestingStartTime', getU64Codec()],
    ['cancelledAt', getU64Codec()],
    ['padding1', getU64Codec()],
    ['buffer', getArrayCodec(getU128Codec(), { size: 5 })],
]);

export function deserializeVestingEscrowAccount(data: Uint8Array): VestingEscrowAccountData {
    const deserialized = VestingEscrowAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VestingEscrowAccountData;
}

export async function fetchVestingEscrowAccount(
    connection: Connection,
    address: Address,
): Promise<VestingEscrowAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('VestingEscrow account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVestingEscrowAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVestingEscrowAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VestingEscrowAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVestingEscrowAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVestingEscrowAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<VestingEscrowAccount[]> {
    const maybeAccounts = await fetchAllMaybeVestingEscrowAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('VestingEscrow account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VestingEscrowAccount => a !== null);
}

export async function fetchProgramAccountsVestingEscrow(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VestingEscrowAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'hteFiUjrzUz' } }, { dataSize: 296 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVestingEscrowAccount(account.data),
    }));
}
