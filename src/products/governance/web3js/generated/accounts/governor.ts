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
import { getGovernanceParametersDecoder, type GovernanceParameters } from '../types/governanceParameters';
import { getVotingRewardDecoder, type VotingReward } from '../types/votingReward';

export type GovernorAccountData = {
    /** Base. */
    base: Address;
    /** Bump seed */
    bump: number;
    /** The total number of [Proposal]s */
    proposalCount: bigint;
    /**
     * The voting body associated with the Governor.
     * This account is responsible for handling vote proceedings, such as:
     * - activating proposals
     * - setting the number of votes per voter
     */
    locker: Address;
    /** This smart wallet executes proposals. */
    smartWallet: Address;
    /** Governance parameters. */
    params: GovernanceParameters;
    /** optional reward, can set by smartwallet */
    votingReward: VotingReward;
    /** buffer for further use */
    buffers: Array<bigint>;
};

export interface GovernorAccount {
    address: Address;
    data: GovernorAccountData;
}

function getGovernorAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** Base. */
    base: Address;
    /** Bump seed */
    bump: number;
    /** The total number of [Proposal]s */
    proposalCount: bigint;
    /**
     * The voting body associated with the Governor.
     * This account is responsible for handling vote proceedings, such as:
     * - activating proposals
     * - setting the number of votes per voter
     */
    locker: Address;
    /** This smart wallet executes proposals. */
    smartWallet: Address;
    /** Governance parameters. */
    params: GovernanceParameters;
    /** optional reward, can set by smartwallet */
    votingReward: VotingReward;
    /** buffer for further use */
    buffers: Array<bigint>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['bump', getU8Decoder()],
        ['proposalCount', getU64Decoder()],
        ['locker', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['smartWallet', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['params', getGovernanceParametersDecoder()],
        ['votingReward', getVotingRewardDecoder()],
        ['buffers', getArrayDecoder(getU128Decoder(), { size: 32 })],
    ]);
}

export function deserializeGovernorAccount(data: Uint8Array): GovernorAccountData {
    const deserialized = getGovernorAccountDataDecoder().decode(data);
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
