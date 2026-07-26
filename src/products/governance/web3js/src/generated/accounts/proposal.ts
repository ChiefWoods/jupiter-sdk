import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { ProposalInstruction, proposalInstructionCodec } from '../types/proposalInstruction';
import { VotingReward, votingRewardCodec } from '../types/votingReward';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getI64Codec,
    getStructCodec,
    getU128Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface ProposalAccountData {
    governor: Address;
    index: bigint;
    bump: number;
    proposer: Address;
    quorumVotes: bigint;
    maxOption: number;
    optionVotes: Array<bigint>;
    canceledAt: bigint;
    createdAt: bigint;
    activatedAt: bigint;
    votingEndsAt: bigint;
    queuedAt: bigint;
    queuedTransaction: Address;
    votingReward: VotingReward;
    totalClaimedReward: bigint;
    proposalType: number;
    buffers: Array<bigint>;
    instructions: Array<ProposalInstruction>;
}

export interface ProposalAccount {
    address: Address;
    data: ProposalAccountData;
}

const ProposalAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'governor',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['index', getU64Codec()],
    ['bump', getU8Codec()],
    [
        'proposer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['quorumVotes', getU64Codec()],
    ['maxOption', getU8Codec()],
    ['optionVotes', getArrayCodec(getU64Codec())],
    ['canceledAt', getI64Codec()],
    ['createdAt', getI64Codec()],
    ['activatedAt', getI64Codec()],
    ['votingEndsAt', getI64Codec()],
    ['queuedAt', getI64Codec()],
    [
        'queuedTransaction',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['votingReward', votingRewardCodec],
    ['totalClaimedReward', getU64Codec()],
    ['proposalType', getU8Codec()],
    ['buffers', getArrayCodec(getU128Codec(), { size: 10 })],
    ['instructions', getArrayCodec(proposalInstructionCodec)],
]);

export function deserializeProposalAccount(data: Uint8Array): ProposalAccountData {
    const deserialized = ProposalAccountDataCodec.decode(data);
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
