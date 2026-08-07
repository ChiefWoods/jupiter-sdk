import { Address, TransactionInstruction } from '@solana/web3.js';
import { CAMPAIGN_ACCOUNT_DISCRIMINATOR } from '../accounts/campaign';
import {
    CLAIM_INSTRUCTION_DISCRIMINATOR,
    parseClaimInstruction,
    type ParsedClaimInstruction,
} from '../instructions/claim';
import { CLAIM_STATUS_ACCOUNT_DISCRIMINATOR } from '../accounts/claimStatus';
import {
    CLAWBACK_INSTRUCTION_DISCRIMINATOR,
    parseClawbackInstruction,
    type ParsedClawbackInstruction,
} from '../instructions/clawback';
import {
    CLOSE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR,
    parseCloseClaimStatusInstruction,
    type ParsedCloseClaimStatusInstruction,
} from '../instructions/closeClaimStatus';
import {
    IDEMPOTENT_CLAIM_INSTRUCTION_DISCRIMINATOR,
    parseIdempotentClaimInstruction,
    type ParsedIdempotentClaimInstruction,
} from '../instructions/idempotentClaim';
import {
    INITIALIZE_CAMPAIGN_INSTRUCTION_DISCRIMINATOR,
    parseInitializeCampaignInstruction,
    type ParsedInitializeCampaignInstruction,
} from '../instructions/initializeCampaign';
import {
    INITIALIZE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR,
    parseInitializeClaimStatusInstruction,
    type ParsedInitializeClaimStatusInstruction,
} from '../instructions/initializeClaimStatus';
import {
    SET_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseSetAdminInstruction,
    type ParsedSetAdminInstruction,
} from '../instructions/setAdmin';
import {
    SET_CLAWBACK_RECEIVER_INSTRUCTION_DISCRIMINATOR,
    parseSetClawbackReceiverInstruction,
    type ParsedSetClawbackReceiverInstruction,
} from '../instructions/setClawbackReceiver';

export const REWARDSHUB_PROGRAM_ID = new Address('GenieRGuCtgfDGThwjp2GLreQMFtJoG1fqFE8MF1gAzG');
export const REWARDS_HUB_PROGRAM_ADDRESS = REWARDSHUB_PROGRAM_ID;

export interface RewardsHubProgram {
    name: 'rewardsHub';
    programId: Address;
}

export function getRewardsHubProgram(programId: Address = REWARDSHUB_PROGRAM_ID): RewardsHubProgram {
    return { name: 'rewardsHub', programId };
}

export enum RewardsHubAccount {
    Campaign,
    ClaimStatus,
}

export function identifyRewardsHubAccount(account: { data: Uint8Array } | Uint8Array): RewardsHubAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (CAMPAIGN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubAccount.Campaign;
    if (CLAIM_STATUS_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubAccount.ClaimStatus;
    throw new Error('Failed to identify RewardsHub account');
}

export enum RewardsHubInstruction {
    Claim,
    Clawback,
    CloseClaimStatus,
    IdempotentClaim,
    InitializeCampaign,
    InitializeClaimStatus,
    SetAdmin,
    SetClawbackReceiver,
}

export function identifyRewardsHubInstruction(instruction: { data: Uint8Array } | Uint8Array): RewardsHubInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.Claim;
    if (CLAWBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.Clawback;
    if (CLOSE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.CloseClaimStatus;
    if (IDEMPOTENT_CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.IdempotentClaim;
    if (INITIALIZE_CAMPAIGN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.InitializeCampaign;
    if (INITIALIZE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.InitializeClaimStatus;
    if (SET_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.SetAdmin;
    if (SET_CLAWBACK_RECEIVER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return RewardsHubInstruction.SetClawbackReceiver;
    throw new Error('Failed to identify RewardsHub instruction');
}

export type ParsedRewardsHubInstruction =
    | ({ instructionType: RewardsHubInstruction.Claim } & ParsedClaimInstruction)
    | ({ instructionType: RewardsHubInstruction.Clawback } & ParsedClawbackInstruction)
    | ({ instructionType: RewardsHubInstruction.CloseClaimStatus } & ParsedCloseClaimStatusInstruction)
    | ({ instructionType: RewardsHubInstruction.IdempotentClaim } & ParsedIdempotentClaimInstruction)
    | ({ instructionType: RewardsHubInstruction.InitializeCampaign } & ParsedInitializeCampaignInstruction)
    | ({ instructionType: RewardsHubInstruction.InitializeClaimStatus } & ParsedInitializeClaimStatusInstruction)
    | ({ instructionType: RewardsHubInstruction.SetAdmin } & ParsedSetAdminInstruction)
    | ({ instructionType: RewardsHubInstruction.SetClawbackReceiver } & ParsedSetClawbackReceiverInstruction);

export function parseRewardsHubInstruction(instruction: TransactionInstruction): ParsedRewardsHubInstruction {
    const instructionType = identifyRewardsHubInstruction(instruction);
    switch (instructionType) {
        case RewardsHubInstruction.Claim:
            return {
                instructionType,
                ...parseClaimInstruction(instruction),
            };
        case RewardsHubInstruction.Clawback:
            return {
                instructionType,
                ...parseClawbackInstruction(instruction),
            };
        case RewardsHubInstruction.CloseClaimStatus:
            return {
                instructionType,
                ...parseCloseClaimStatusInstruction(instruction),
            };
        case RewardsHubInstruction.IdempotentClaim:
            return {
                instructionType,
                ...parseIdempotentClaimInstruction(instruction),
            };
        case RewardsHubInstruction.InitializeCampaign:
            return {
                instructionType,
                ...parseInitializeCampaignInstruction(instruction),
            };
        case RewardsHubInstruction.InitializeClaimStatus:
            return {
                instructionType,
                ...parseInitializeClaimStatusInstruction(instruction),
            };
        case RewardsHubInstruction.SetAdmin:
            return {
                instructionType,
                ...parseSetAdminInstruction(instruction),
            };
        case RewardsHubInstruction.SetClawbackReceiver:
            return {
                instructionType,
                ...parseSetClawbackReceiverInstruction(instruction),
            };
    }
}
