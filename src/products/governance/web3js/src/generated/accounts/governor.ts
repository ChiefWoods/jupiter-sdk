import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { GovernanceParameters, governanceParametersCodec } from '../types/governanceParameters';
import { VotingReward, votingRewardCodec } from '../types/votingReward';
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

export interface GovernorAccountData {
    base: Address;
    bump: number;
    proposalCount: bigint;
    locker: Address;
    smartWallet: Address;
    params: GovernanceParameters;
    votingReward: VotingReward;
    buffers: Array<bigint>;
}

export interface GovernorAccount {
    address: Address;
    data: GovernorAccountData;
}

const GovernorAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'base',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['bump', getU8Codec()],
    ['proposalCount', getU64Codec()],
    [
        'locker',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'smartWallet',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['params', governanceParametersCodec],
    ['votingReward', votingRewardCodec],
    ['buffers', getArrayCodec(getU128Codec(), { size: 32 })],
]);

export function deserializeGovernorAccount(data: Uint8Array): GovernorAccountData {
    const deserialized = GovernorAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as GovernorAccountData;
}

export async function fetchGovernorAccount(connection: Connection, address: Address): Promise<GovernorAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Governor account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeGovernorAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeGovernorAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(GovernorAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeGovernorAccount(accountInfo.data),
        };
    });
}

export async function fetchAllGovernorAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<GovernorAccount[]> {
    const maybeAccounts = await fetchAllMaybeGovernorAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Governor account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is GovernorAccount => a !== null);
}

export async function fetchProgramAccountsGovernor(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<GovernorAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '7H7Bw7RrAmF' } }, { dataSize: 729 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeGovernorAccount(account.data),
    }));
}
