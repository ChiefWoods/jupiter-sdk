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

export const VESTING_ESCROW_ACCOUNT_DISCRIMINATOR = new Uint8Array([244, 119, 183, 4, 73, 116, 135, 195]);

export type VestingEscrowAccountData = {
    /** recipient address */
    recipient: Address;
    /** token mint */
    tokenMint: Address;
    /** creator of the escrow */
    creator: Address;
    /** escrow base key */
    base: Address;
    /** escrow bump */
    escrowBump: number;
    /** update_recipient_mode */
    updateRecipientMode: number;
    /** cancel_mode */
    cancelMode: number;
    /** token program flag */
    tokenProgramFlag: number;
    /** padding */
    padding0: ReadonlyUint8Array;
    /** cliff time */
    cliffTime: bigint;
    /** frequency */
    frequency: bigint;
    /** cliff unlock amount */
    cliffUnlockAmount: bigint;
    /** amount per period */
    amountPerPeriod: bigint;
    /** number of period */
    numberOfPeriod: bigint;
    /** total claimed amount */
    totalClaimedAmount: bigint;
    /** vesting start time */
    vestingStartTime: bigint;
    /** cancelled_at */
    cancelledAt: bigint;
    /** buffer */
    padding1: bigint;
    /** buffer */
    buffer: Array<bigint>;
};

export interface VestingEscrowAccount {
    address: Address;
    data: VestingEscrowAccountData;
}

function getVestingEscrowAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** recipient address */
    recipient: Address;
    /** token mint */
    tokenMint: Address;
    /** creator of the escrow */
    creator: Address;
    /** escrow base key */
    base: Address;
    /** escrow bump */
    escrowBump: number;
    /** update_recipient_mode */
    updateRecipientMode: number;
    /** cancel_mode */
    cancelMode: number;
    /** token program flag */
    tokenProgramFlag: number;
    /** padding */
    padding0: ReadonlyUint8Array;
    /** cliff time */
    cliffTime: bigint;
    /** frequency */
    frequency: bigint;
    /** cliff unlock amount */
    cliffUnlockAmount: bigint;
    /** amount per period */
    amountPerPeriod: bigint;
    /** number of period */
    numberOfPeriod: bigint;
    /** total claimed amount */
    totalClaimedAmount: bigint;
    /** vesting start time */
    vestingStartTime: bigint;
    /** cancelled_at */
    cancelledAt: bigint;
    /** buffer */
    padding1: bigint;
    /** buffer */
    buffer: Array<bigint>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['recipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['escrowBump', getU8Decoder()],
        ['updateRecipientMode', getU8Decoder()],
        ['cancelMode', getU8Decoder()],
        ['tokenProgramFlag', getU8Decoder()],
        ['padding0', fixDecoderSize(getBytesDecoder(), 4)],
        ['cliffTime', getU64Decoder()],
        ['frequency', getU64Decoder()],
        ['cliffUnlockAmount', getU64Decoder()],
        ['amountPerPeriod', getU64Decoder()],
        ['numberOfPeriod', getU64Decoder()],
        ['totalClaimedAmount', getU64Decoder()],
        ['vestingStartTime', getU64Decoder()],
        ['cancelledAt', getU64Decoder()],
        ['padding1', getU64Decoder()],
        ['buffer', getArrayDecoder(getU128Decoder(), { size: 5 })],
    ]);
}

export function deserializeVestingEscrowAccount(data: Uint8Array): VestingEscrowAccountData {
    if (!VESTING_ESCROW_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VestingEscrowAccount discriminator mismatch');
    }
    const deserialized = getVestingEscrowAccountDataDecoder().decode(data);
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
