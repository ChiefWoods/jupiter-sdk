import {
    ACTIVATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR,
    parseActivateProposalInstruction,
    type ParsedActivateProposalInstruction,
} from '../instructions/activateProposal';
import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CANCEL_PROPOSAL_INSTRUCTION_DISCRIMINATOR,
    parseCancelProposalInstruction,
    type ParsedCancelProposalInstruction,
} from '../instructions/cancelProposal';
import {
    CLAIM_REWARD_INSTRUCTION_DISCRIMINATOR,
    parseClaimRewardInstruction,
    type ParsedClaimRewardInstruction,
} from '../instructions/claimReward';
import {
    CREATE_GOVERNOR_INSTRUCTION_DISCRIMINATOR,
    parseCreateGovernorInstruction,
    type ParsedCreateGovernorInstruction,
} from '../instructions/createGovernor';
import {
    CREATE_OPTION_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR,
    parseCreateOptionProposalMetaInstruction,
    type ParsedCreateOptionProposalMetaInstruction,
} from '../instructions/createOptionProposalMeta';
import {
    CREATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR,
    parseCreateProposalInstruction,
    type ParsedCreateProposalInstruction,
} from '../instructions/createProposal';
import {
    CREATE_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR,
    parseCreateProposalMetaInstruction,
    type ParsedCreateProposalMetaInstruction,
} from '../instructions/createProposalMeta';
import { GOVERNOR_ACCOUNT_DISCRIMINATOR } from '../accounts/governor';
import {
    NEW_VOTE_INSTRUCTION_DISCRIMINATOR,
    parseNewVoteInstruction,
    type ParsedNewVoteInstruction,
} from '../instructions/newVote';
import { OPTION_PROPOSAL_META_ACCOUNT_DISCRIMINATOR } from '../accounts/optionProposalMeta';
import { PROPOSAL_ACCOUNT_DISCRIMINATOR } from '../accounts/proposal';
import { PROPOSAL_META_ACCOUNT_DISCRIMINATOR } from '../accounts/proposalMeta';
import {
    QUEUE_PROPOSAL_INSTRUCTION_DISCRIMINATOR,
    parseQueueProposalInstruction,
    type ParsedQueueProposalInstruction,
} from '../instructions/queueProposal';
import {
    SET_GOVERNANCE_PARAMS_INSTRUCTION_DISCRIMINATOR,
    parseSetGovernanceParamsInstruction,
    type ParsedSetGovernanceParamsInstruction,
} from '../instructions/setGovernanceParams';
import {
    SET_LOCKER_INSTRUCTION_DISCRIMINATOR,
    parseSetLockerInstruction,
    type ParsedSetLockerInstruction,
} from '../instructions/setLocker';
import {
    SET_VOTE_INSTRUCTION_DISCRIMINATOR,
    parseSetVoteInstruction,
    type ParsedSetVoteInstruction,
} from '../instructions/setVote';
import {
    SET_VOTING_REWARD_INSTRUCTION_DISCRIMINATOR,
    parseSetVotingRewardInstruction,
    type ParsedSetVotingRewardInstruction,
} from '../instructions/setVotingReward';
import { VOTE_ACCOUNT_DISCRIMINATOR } from '../accounts/vote';

export const GOVERNANCE_PROGRAM_ID = new Address('GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY');
export const GOVERNANCE_PROGRAM_ADDRESS = GOVERNANCE_PROGRAM_ID;

export interface GovernanceProgram {
    name: 'governance';
    programId: Address;
}

export function getGovernanceProgram(programId: Address = GOVERNANCE_PROGRAM_ID): GovernanceProgram {
    return { name: 'governance', programId };
}

export enum GovernanceAccount {
    Governor,
    Proposal,
    ProposalMeta,
    OptionProposalMeta,
    Vote,
}

export function identifyGovernanceAccount(account: { data: Uint8Array } | Uint8Array): GovernanceAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (GOVERNOR_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceAccount.Governor;
    if (PROPOSAL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceAccount.Proposal;
    if (PROPOSAL_META_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceAccount.ProposalMeta;
    if (OPTION_PROPOSAL_META_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceAccount.OptionProposalMeta;
    if (VOTE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return GovernanceAccount.Vote;
    throw new Error('Failed to identify Governance account');
}

export enum GovernanceInstruction {
    CreateGovernor,
    CreateProposal,
    ActivateProposal,
    CancelProposal,
    QueueProposal,
    NewVote,
    SetVote,
    SetGovernanceParams,
    SetVotingReward,
    ClaimReward,
    SetLocker,
    CreateProposalMeta,
    CreateOptionProposalMeta,
}

export function identifyGovernanceInstruction(instruction: { data: Uint8Array } | Uint8Array): GovernanceInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CREATE_GOVERNOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.CreateGovernor;
    if (CREATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.CreateProposal;
    if (ACTIVATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.ActivateProposal;
    if (CANCEL_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.CancelProposal;
    if (QUEUE_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.QueueProposal;
    if (NEW_VOTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.NewVote;
    if (SET_VOTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.SetVote;
    if (SET_GOVERNANCE_PARAMS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.SetGovernanceParams;
    if (SET_VOTING_REWARD_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.SetVotingReward;
    if (CLAIM_REWARD_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.ClaimReward;
    if (SET_LOCKER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.SetLocker;
    if (CREATE_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.CreateProposalMeta;
    if (CREATE_OPTION_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return GovernanceInstruction.CreateOptionProposalMeta;
    throw new Error('Failed to identify Governance instruction');
}

export type ParsedGovernanceInstruction =
    | ({ instructionType: GovernanceInstruction.CreateGovernor } & ParsedCreateGovernorInstruction)
    | ({ instructionType: GovernanceInstruction.CreateProposal } & ParsedCreateProposalInstruction)
    | ({ instructionType: GovernanceInstruction.ActivateProposal } & ParsedActivateProposalInstruction)
    | ({ instructionType: GovernanceInstruction.CancelProposal } & ParsedCancelProposalInstruction)
    | ({ instructionType: GovernanceInstruction.QueueProposal } & ParsedQueueProposalInstruction)
    | ({ instructionType: GovernanceInstruction.NewVote } & ParsedNewVoteInstruction)
    | ({ instructionType: GovernanceInstruction.SetVote } & ParsedSetVoteInstruction)
    | ({ instructionType: GovernanceInstruction.SetGovernanceParams } & ParsedSetGovernanceParamsInstruction)
    | ({ instructionType: GovernanceInstruction.SetVotingReward } & ParsedSetVotingRewardInstruction)
    | ({ instructionType: GovernanceInstruction.ClaimReward } & ParsedClaimRewardInstruction)
    | ({ instructionType: GovernanceInstruction.SetLocker } & ParsedSetLockerInstruction)
    | ({ instructionType: GovernanceInstruction.CreateProposalMeta } & ParsedCreateProposalMetaInstruction)
    | ({ instructionType: GovernanceInstruction.CreateOptionProposalMeta } & ParsedCreateOptionProposalMetaInstruction);

export function parseGovernanceInstruction(instruction: TransactionInstruction): ParsedGovernanceInstruction {
    const instructionType = identifyGovernanceInstruction(instruction);
    switch (instructionType) {
        case GovernanceInstruction.CreateGovernor:
            return {
                instructionType,
                ...parseCreateGovernorInstruction(instruction),
            };
        case GovernanceInstruction.CreateProposal:
            return {
                instructionType,
                ...parseCreateProposalInstruction(instruction),
            };
        case GovernanceInstruction.ActivateProposal:
            return {
                instructionType,
                ...parseActivateProposalInstruction(instruction),
            };
        case GovernanceInstruction.CancelProposal:
            return {
                instructionType,
                ...parseCancelProposalInstruction(instruction),
            };
        case GovernanceInstruction.QueueProposal:
            return {
                instructionType,
                ...parseQueueProposalInstruction(instruction),
            };
        case GovernanceInstruction.NewVote:
            return {
                instructionType,
                ...parseNewVoteInstruction(instruction),
            };
        case GovernanceInstruction.SetVote:
            return {
                instructionType,
                ...parseSetVoteInstruction(instruction),
            };
        case GovernanceInstruction.SetGovernanceParams:
            return {
                instructionType,
                ...parseSetGovernanceParamsInstruction(instruction),
            };
        case GovernanceInstruction.SetVotingReward:
            return {
                instructionType,
                ...parseSetVotingRewardInstruction(instruction),
            };
        case GovernanceInstruction.ClaimReward:
            return {
                instructionType,
                ...parseClaimRewardInstruction(instruction),
            };
        case GovernanceInstruction.SetLocker:
            return {
                instructionType,
                ...parseSetLockerInstruction(instruction),
            };
        case GovernanceInstruction.CreateProposalMeta:
            return {
                instructionType,
                ...parseCreateProposalMetaInstruction(instruction),
            };
        case GovernanceInstruction.CreateOptionProposalMeta:
            return {
                instructionType,
                ...parseCreateOptionProposalMetaInstruction(instruction),
            };
    }
}
