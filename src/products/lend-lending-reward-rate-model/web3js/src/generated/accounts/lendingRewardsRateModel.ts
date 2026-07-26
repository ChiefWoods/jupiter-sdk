import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU64Codec, getU8Codec, transformCodec } from '@solana/codecs';

export interface LendingRewardsRateModelAccountData {
    mint: Address;
    startTvl: bigint;
    duration: bigint;
    startTime: bigint;
    yearlyReward: bigint;
    nextDuration: bigint;
    nextRewardAmount: bigint;
    bump: number;
}

export interface LendingRewardsRateModelAccount {
    address: Address;
    data: LendingRewardsRateModelAccountData;
}

const LendingRewardsRateModelAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['startTvl', getU64Codec()],
    ['duration', getU64Codec()],
    ['startTime', getU64Codec()],
    ['yearlyReward', getU64Codec()],
    ['nextDuration', getU64Codec()],
    ['nextRewardAmount', getU64Codec()],
    ['bump', getU8Codec()],
]);

export function deserializeLendingRewardsRateModelAccount(data: Uint8Array): LendingRewardsRateModelAccountData {
    const deserialized = LendingRewardsRateModelAccountDataCodec.decode(data);
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
