import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU128Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getProposalInstructionDecoder, type ProposalInstruction } from '../types/proposalInstruction';
import { getVotingRewardDecoder, type VotingReward } from '../types/votingReward';

export const PROPOSAL_ACCOUNT_DISCRIMINATOR = new Uint8Array([26, 94, 189, 187, 116, 136, 53, 33]);

export type ProposalAccountData = {
    /** The public key of the governor. */
    governor: Address;
    /** The unique ID of the proposal, auto-incremented. */
    index: bigint;
    /** Bump seed */
    bump: number;
    /** The public key of the proposer. */
    proposer: Address;
    /** The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed */
    quorumVotes: bigint;
    /** maximum options of the proposal */
    maxOption: number;
    /** Vote for each option */
    optionVotes: Array<bigint>;
    /** The timestamp when the proposal was canceled. */
    canceledAt: bigint;
    /** The timestamp when the proposal was created. */
    createdAt: bigint;
    /**
     * The timestamp in which the proposal was activated.
     * This is when voting begins.
     */
    activatedAt: bigint;
    /**
     * The timestamp when voting ends.
     * This only applies to active proposals.
     */
    votingEndsAt: bigint;
    /**
     * The timestamp in which the proposal was queued, i.e.
     * approved for execution on the Smart Wallet.
     */
    queuedAt: bigint;
    /** If the transaction was queued, this is the associated Smart Wallet transaction. */
    queuedTransaction: Address;
    /** optional reward */
    votingReward: VotingReward;
    /** total claimed reward */
    totalClaimedReward: bigint;
    proposalType: number;
    /** buffers for future use */
    buffers: Array<bigint>;
    /** The instructions associated with the proposal. */
    instructions: Array<ProposalInstruction>;
};

export interface ProposalAccount {
    address: Address;
    data: ProposalAccountData;
}

function getProposalAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** The public key of the governor. */
    governor: Address;
    /** The unique ID of the proposal, auto-incremented. */
    index: bigint;
    /** Bump seed */
    bump: number;
    /** The public key of the proposer. */
    proposer: Address;
    /** The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed */
    quorumVotes: bigint;
    /** maximum options of the proposal */
    maxOption: number;
    /** Vote for each option */
    optionVotes: Array<bigint>;
    /** The timestamp when the proposal was canceled. */
    canceledAt: bigint;
    /** The timestamp when the proposal was created. */
    createdAt: bigint;
    /**
     * The timestamp in which the proposal was activated.
     * This is when voting begins.
     */
    activatedAt: bigint;
    /**
     * The timestamp when voting ends.
     * This only applies to active proposals.
     */
    votingEndsAt: bigint;
    /**
     * The timestamp in which the proposal was queued, i.e.
     * approved for execution on the Smart Wallet.
     */
    queuedAt: bigint;
    /** If the transaction was queued, this is the associated Smart Wallet transaction. */
    queuedTransaction: Address;
    /** optional reward */
    votingReward: VotingReward;
    /** total claimed reward */
    totalClaimedReward: bigint;
    proposalType: number;
    /** buffers for future use */
    buffers: Array<bigint>;
    /** The instructions associated with the proposal. */
    instructions: Array<ProposalInstruction>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['index', getU64Decoder()],
        ['bump', getU8Decoder()],
        ['proposer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['quorumVotes', getU64Decoder()],
        ['maxOption', getU8Decoder()],
        ['optionVotes', getArrayDecoder(getU64Decoder())],
        ['canceledAt', getI64Decoder()],
        ['createdAt', getI64Decoder()],
        ['activatedAt', getI64Decoder()],
        ['votingEndsAt', getI64Decoder()],
        ['queuedAt', getI64Decoder()],
        ['queuedTransaction', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['votingReward', getVotingRewardDecoder()],
        ['totalClaimedReward', getU64Decoder()],
        ['proposalType', getU8Decoder()],
        ['buffers', getArrayDecoder(getU128Decoder(), { size: 10 })],
        ['instructions', getArrayDecoder(getProposalInstructionDecoder())],
    ]);
}

export function deserializeProposalAccount(data: Uint8Array): ProposalAccountData {
    if (!PROPOSAL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalAccount discriminator mismatch');
    }
    const deserialized = getProposalAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as ProposalAccountData;
}

export async function fetchProposalAccount(connection: Connection, address: Address): Promise<ProposalAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Proposal account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeProposalAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeProposalAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(ProposalAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeProposalAccount(accountInfo.data),
        };
    });
}

export async function fetchAllProposalAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<ProposalAccount[]> {
    const maybeAccounts = await fetchAllMaybeProposalAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Proposal account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is ProposalAccount => a !== null);
}

export async function fetchProgramAccountsProposal(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<ProposalAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '5Qpj1hsHT4k' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeProposalAccount(account.data),
    }));
}
