import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CANCEL_QUEUED_REWARDS_INSTRUCTION_DISCRIMINATOR,
    parseCancelQueuedRewardsInstruction,
    type ParsedCancelQueuedRewardsInstruction,
} from '../instructions/cancelQueuedRewards';
import {
    INIT_LENDING_REWARDS_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseInitLendingRewardsAdminInstruction,
    type ParsedInitLendingRewardsAdminInstruction,
} from '../instructions/initLendingRewardsAdmin';
import {
    INIT_LENDING_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR,
    parseInitLendingRewardsRateModelInstruction,
    type ParsedInitLendingRewardsRateModelInstruction,
} from '../instructions/initLendingRewardsRateModel';
import { LENDING_REWARDS_ADMIN_ACCOUNT_DISCRIMINATOR } from '../accounts/lendingRewardsAdmin';
import { LENDING_REWARDS_RATE_MODEL_ACCOUNT_DISCRIMINATOR } from '../accounts/lendingRewardsRateModel';
import {
    QUEUE_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR,
    parseQueueNextRewardsInstruction,
    type ParsedQueueNextRewardsInstruction,
} from '../instructions/queueNextRewards';
import {
    START_REWARDS_INSTRUCTION_DISCRIMINATOR,
    parseStartRewardsInstruction,
    type ParsedStartRewardsInstruction,
} from '../instructions/startRewards';
import {
    STOP_REWARDS_INSTRUCTION_DISCRIMINATOR,
    parseStopRewardsInstruction,
    type ParsedStopRewardsInstruction,
} from '../instructions/stopRewards';
import {
    TRANSITION_TO_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR,
    parseTransitionToNextRewardsInstruction,
    type ParsedTransitionToNextRewardsInstruction,
} from '../instructions/transitionToNextRewards';
import {
    UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR,
    parseUpdateAuthorityInstruction,
    type ParsedUpdateAuthorityInstruction,
} from '../instructions/updateAuthority';
import {
    UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateAuthsInstruction,
    type ParsedUpdateAuthsInstruction,
} from '../instructions/updateAuths';

export const LENDLENDINGREWARDRATEMODEL_PROGRAM_ID = new Address('jup7TthsMgcR9Y3L277b8Eo9uboVSmu1utkuXHNUKar');
export const LEND_LENDING_REWARD_RATE_MODEL_PROGRAM_ADDRESS = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID;

export interface LendLendingRewardRateModelProgram {
    name: 'lendLendingRewardRateModel';
    programId: Address;
}

export function getLendLendingRewardRateModelProgram(
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): LendLendingRewardRateModelProgram {
    return { name: 'lendLendingRewardRateModel', programId };
}

export enum LendLendingRewardRateModelAccount {
    LendingRewardsAdmin,
    LendingRewardsRateModel,
}

export function identifyLendLendingRewardRateModelAccount(
    account: { data: Uint8Array } | Uint8Array,
): LendLendingRewardRateModelAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (LENDING_REWARDS_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelAccount.LendingRewardsAdmin;
    if (LENDING_REWARDS_RATE_MODEL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelAccount.LendingRewardsRateModel;
    throw new Error('Failed to identify LendLendingRewardRateModel account');
}

export enum LendLendingRewardRateModelInstruction {
    CancelQueuedRewards,
    InitLendingRewardsAdmin,
    InitLendingRewardsRateModel,
    QueueNextRewards,
    StartRewards,
    StopRewards,
    TransitionToNextRewards,
    UpdateAuthority,
    UpdateAuths,
}

export function identifyLendLendingRewardRateModelInstruction(
    instruction: { data: Uint8Array } | Uint8Array,
): LendLendingRewardRateModelInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CANCEL_QUEUED_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.CancelQueuedRewards;
    if (INIT_LENDING_REWARDS_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.InitLendingRewardsAdmin;
    if (INIT_LENDING_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.InitLendingRewardsRateModel;
    if (QUEUE_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.QueueNextRewards;
    if (START_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.StartRewards;
    if (STOP_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.StopRewards;
    if (TRANSITION_TO_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.TransitionToNextRewards;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.UpdateAuthority;
    if (UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLendingRewardRateModelInstruction.UpdateAuths;
    throw new Error('Failed to identify LendLendingRewardRateModel instruction');
}

export type ParsedLendLendingRewardRateModelInstruction =
    | ({
          instructionType: LendLendingRewardRateModelInstruction.CancelQueuedRewards;
      } & ParsedCancelQueuedRewardsInstruction)
    | ({
          instructionType: LendLendingRewardRateModelInstruction.InitLendingRewardsAdmin;
      } & ParsedInitLendingRewardsAdminInstruction)
    | ({
          instructionType: LendLendingRewardRateModelInstruction.InitLendingRewardsRateModel;
      } & ParsedInitLendingRewardsRateModelInstruction)
    | ({ instructionType: LendLendingRewardRateModelInstruction.QueueNextRewards } & ParsedQueueNextRewardsInstruction)
    | ({ instructionType: LendLendingRewardRateModelInstruction.StartRewards } & ParsedStartRewardsInstruction)
    | ({ instructionType: LendLendingRewardRateModelInstruction.StopRewards } & ParsedStopRewardsInstruction)
    | ({
          instructionType: LendLendingRewardRateModelInstruction.TransitionToNextRewards;
      } & ParsedTransitionToNextRewardsInstruction)
    | ({ instructionType: LendLendingRewardRateModelInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction)
    | ({ instructionType: LendLendingRewardRateModelInstruction.UpdateAuths } & ParsedUpdateAuthsInstruction);

export function parseLendLendingRewardRateModelInstruction(
    instruction: TransactionInstruction,
): ParsedLendLendingRewardRateModelInstruction {
    const instructionType = identifyLendLendingRewardRateModelInstruction(instruction);
    switch (instructionType) {
        case LendLendingRewardRateModelInstruction.CancelQueuedRewards:
            return {
                instructionType,
                ...parseCancelQueuedRewardsInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.InitLendingRewardsAdmin:
            return {
                instructionType,
                ...parseInitLendingRewardsAdminInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.InitLendingRewardsRateModel:
            return {
                instructionType,
                ...parseInitLendingRewardsRateModelInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.QueueNextRewards:
            return {
                instructionType,
                ...parseQueueNextRewardsInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.StartRewards:
            return {
                instructionType,
                ...parseStartRewardsInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.StopRewards:
            return {
                instructionType,
                ...parseStopRewardsInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.TransitionToNextRewards:
            return {
                instructionType,
                ...parseTransitionToNextRewardsInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
        case LendLendingRewardRateModelInstruction.UpdateAuths:
            return {
                instructionType,
                ...parseUpdateAuthsInstruction(instruction),
            };
    }
}
