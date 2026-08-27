import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const LENDING_REWARDS_RATE_MODEL_ACCOUNT_DISCRIMINATOR = new Uint8Array([166, 72, 71, 131, 172, 74, 166, 181]);

export type LendingRewardsRateModelAccountData = {
    /** @dev mint address */
    mint: Address;
    /**
     * @dev tvl below which rewards rate is 0. If current TVL is below this value, triggering `update_rate()` on the fToken
     * might bring the total TVL above this cut-off.
     */
    startTvl: bigint;
    /** @dev for how long current rewards should run */
    duration: bigint;
    /** @dev when current rewards got started */
    startTime: bigint;
    /** @dev current annualized reward based on input params (duration, rewardAmount) */
    yearlyReward: bigint;
    /** @dev Duration for the next rewards phase */
    nextDuration: bigint;
    /** @dev Amount of rewards for the next phase */
    nextRewardAmount: bigint;
    bump: number;
};

export interface LendingRewardsRateModelAccount {
    address: Address;
    data: LendingRewardsRateModelAccountData;
}

function getLendingRewardsRateModelAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** @dev mint address */
    mint: Address;
    /**
     * @dev tvl below which rewards rate is 0. If current TVL is below this value, triggering `update_rate()` on the fToken
     * might bring the total TVL above this cut-off.
     */
    startTvl: bigint;
    /** @dev for how long current rewards should run */
    duration: bigint;
    /** @dev when current rewards got started */
    startTime: bigint;
    /** @dev current annualized reward based on input params (duration, rewardAmount) */
    yearlyReward: bigint;
    /** @dev Duration for the next rewards phase */
    nextDuration: bigint;
    /** @dev Amount of rewards for the next phase */
    nextRewardAmount: bigint;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['startTvl', getU64Decoder()],
        ['duration', getU64Decoder()],
        ['startTime', getU64Decoder()],
        ['yearlyReward', getU64Decoder()],
        ['nextDuration', getU64Decoder()],
        ['nextRewardAmount', getU64Decoder()],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeLendingRewardsRateModelAccount(data: Uint8Array): LendingRewardsRateModelAccountData {
    if (!LENDING_REWARDS_RATE_MODEL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LendingRewardsRateModelAccount discriminator mismatch');
    }
    const deserialized = getLendingRewardsRateModelAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as LendingRewardsRateModelAccountData;
}

export async function fetchLendingRewardsRateModelAccount(
    connection: Connection,
    address: Address,
): Promise<LendingRewardsRateModelAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('LendingRewardsRateModel account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeLendingRewardsRateModelAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeLendingRewardsRateModelAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(LendingRewardsRateModelAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeLendingRewardsRateModelAccount(accountInfo.data),
        };
    });
}

export async function fetchAllLendingRewardsRateModelAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<LendingRewardsRateModelAccount[]> {
    const maybeAccounts = await fetchAllMaybeLendingRewardsRateModelAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('LendingRewardsRateModel account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is LendingRewardsRateModelAccount => a !== null);
}

export async function fetchProgramAccountsLendingRewardsRateModel(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<LendingRewardsRateModelAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'Up9XXARvXRe' } }, { dataSize: 89 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeLendingRewardsRateModelAccount(account.data),
    }));
}
