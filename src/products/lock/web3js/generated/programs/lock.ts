import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CANCEL_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR,
    parseCancelVestingEscrowInstruction,
    type ParsedCancelVestingEscrowInstruction,
} from '../instructions/cancelVestingEscrow';
import {
    CLAIM_INSTRUCTION_DISCRIMINATOR,
    parseClaimInstruction,
    type ParsedClaimInstruction,
} from '../instructions/claim';
import {
    CLAIM_V2_INSTRUCTION_DISCRIMINATOR,
    parseClaimV2Instruction,
    type ParsedClaimV2Instruction,
} from '../instructions/claimV2';
import {
    CLOSE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR,
    parseCloseVestingEscrowInstruction,
    type ParsedCloseVestingEscrowInstruction,
} from '../instructions/closeVestingEscrow';
import {
    CREATE_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR,
    parseCreateRootEscrowInstruction,
    type ParsedCreateRootEscrowInstruction,
} from '../instructions/createRootEscrow';
import {
    CREATE_VESTING_ESCROW_FROM_ROOT_INSTRUCTION_DISCRIMINATOR,
    parseCreateVestingEscrowFromRootInstruction,
    type ParsedCreateVestingEscrowFromRootInstruction,
} from '../instructions/createVestingEscrowFromRoot';
import {
    CREATE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR,
    parseCreateVestingEscrowInstruction,
    type ParsedCreateVestingEscrowInstruction,
} from '../instructions/createVestingEscrow';
import {
    CREATE_VESTING_ESCROW_METADATA_INSTRUCTION_DISCRIMINATOR,
    parseCreateVestingEscrowMetadataInstruction,
    type ParsedCreateVestingEscrowMetadataInstruction,
} from '../instructions/createVestingEscrowMetadata';
import {
    CREATE_VESTING_ESCROW_V2_INSTRUCTION_DISCRIMINATOR,
    parseCreateVestingEscrowV2Instruction,
    type ParsedCreateVestingEscrowV2Instruction,
} from '../instructions/createVestingEscrowV2';
import {
    FUND_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR,
    parseFundRootEscrowInstruction,
    type ParsedFundRootEscrowInstruction,
} from '../instructions/fundRootEscrow';
import { ROOT_ESCROW_ACCOUNT_DISCRIMINATOR } from '../accounts/rootEscrow';
import {
    UPDATE_VESTING_ESCROW_RECIPIENT_INSTRUCTION_DISCRIMINATOR,
    parseUpdateVestingEscrowRecipientInstruction,
    type ParsedUpdateVestingEscrowRecipientInstruction,
} from '../instructions/updateVestingEscrowRecipient';
import { VESTING_ESCROW_ACCOUNT_DISCRIMINATOR } from '../accounts/vestingEscrow';
import { VESTING_ESCROW_METADATA_ACCOUNT_DISCRIMINATOR } from '../accounts/vestingEscrowMetadata';

export const LOCK_PROGRAM_ID = new Address('LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn');
export const LOCK_PROGRAM_ADDRESS = LOCK_PROGRAM_ID;

export interface LockProgram {
    name: 'lock';
    programId: Address;
}

export function getLockProgram(programId: Address = LOCK_PROGRAM_ID): LockProgram {
    return { name: 'lock', programId };
}

export enum LockAccount {
    RootEscrow,
    VestingEscrow,
    VestingEscrowMetadata,
}

export function identifyLockAccount(account: { data: Uint8Array } | Uint8Array): LockAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (ROOT_ESCROW_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockAccount.RootEscrow;
    if (VESTING_ESCROW_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockAccount.VestingEscrow;
    if (VESTING_ESCROW_METADATA_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockAccount.VestingEscrowMetadata;
    throw new Error('Failed to identify Lock account');
}

export enum LockInstruction {
    CancelVestingEscrow,
    Claim,
    ClaimV2,
    CloseVestingEscrow,
    CreateRootEscrow,
    CreateVestingEscrow,
    CreateVestingEscrowFromRoot,
    CreateVestingEscrowMetadata,
    CreateVestingEscrowV2,
    FundRootEscrow,
    UpdateVestingEscrowRecipient,
}

export function identifyLockInstruction(instruction: { data: Uint8Array } | Uint8Array): LockInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CANCEL_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CancelVestingEscrow;
    if (CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LockInstruction.Claim;
    if (CLAIM_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.ClaimV2;
    if (CLOSE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CloseVestingEscrow;
    if (CREATE_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CreateRootEscrow;
    if (CREATE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CreateVestingEscrow;
    if (CREATE_VESTING_ESCROW_FROM_ROOT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CreateVestingEscrowFromRoot;
    if (CREATE_VESTING_ESCROW_METADATA_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CreateVestingEscrowMetadata;
    if (CREATE_VESTING_ESCROW_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.CreateVestingEscrowV2;
    if (FUND_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.FundRootEscrow;
    if (UPDATE_VESTING_ESCROW_RECIPIENT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LockInstruction.UpdateVestingEscrowRecipient;
    throw new Error('Failed to identify Lock instruction');
}

export type ParsedLockInstruction =
    | ({ instructionType: LockInstruction.CancelVestingEscrow } & ParsedCancelVestingEscrowInstruction)
    | ({ instructionType: LockInstruction.Claim } & ParsedClaimInstruction)
    | ({ instructionType: LockInstruction.ClaimV2 } & ParsedClaimV2Instruction)
    | ({ instructionType: LockInstruction.CloseVestingEscrow } & ParsedCloseVestingEscrowInstruction)
    | ({ instructionType: LockInstruction.CreateRootEscrow } & ParsedCreateRootEscrowInstruction)
    | ({ instructionType: LockInstruction.CreateVestingEscrow } & ParsedCreateVestingEscrowInstruction)
    | ({ instructionType: LockInstruction.CreateVestingEscrowFromRoot } & ParsedCreateVestingEscrowFromRootInstruction)
    | ({ instructionType: LockInstruction.CreateVestingEscrowMetadata } & ParsedCreateVestingEscrowMetadataInstruction)
    | ({ instructionType: LockInstruction.CreateVestingEscrowV2 } & ParsedCreateVestingEscrowV2Instruction)
    | ({ instructionType: LockInstruction.FundRootEscrow } & ParsedFundRootEscrowInstruction)
    | ({
          instructionType: LockInstruction.UpdateVestingEscrowRecipient;
      } & ParsedUpdateVestingEscrowRecipientInstruction);

export function parseLockInstruction(instruction: TransactionInstruction): ParsedLockInstruction {
    const instructionType = identifyLockInstruction(instruction);
    switch (instructionType) {
        case LockInstruction.CancelVestingEscrow:
            return {
                instructionType,
                ...parseCancelVestingEscrowInstruction(instruction),
            };
        case LockInstruction.Claim:
            return {
                instructionType,
                ...parseClaimInstruction(instruction),
            };
        case LockInstruction.ClaimV2:
            return {
                instructionType,
                ...parseClaimV2Instruction(instruction),
            };
        case LockInstruction.CloseVestingEscrow:
            return {
                instructionType,
                ...parseCloseVestingEscrowInstruction(instruction),
            };
        case LockInstruction.CreateRootEscrow:
            return {
                instructionType,
                ...parseCreateRootEscrowInstruction(instruction),
            };
        case LockInstruction.CreateVestingEscrow:
            return {
                instructionType,
                ...parseCreateVestingEscrowInstruction(instruction),
            };
        case LockInstruction.CreateVestingEscrowFromRoot:
            return {
                instructionType,
                ...parseCreateVestingEscrowFromRootInstruction(instruction),
            };
        case LockInstruction.CreateVestingEscrowMetadata:
            return {
                instructionType,
                ...parseCreateVestingEscrowMetadataInstruction(instruction),
            };
        case LockInstruction.CreateVestingEscrowV2:
            return {
                instructionType,
                ...parseCreateVestingEscrowV2Instruction(instruction),
            };
        case LockInstruction.FundRootEscrow:
            return {
                instructionType,
                ...parseFundRootEscrowInstruction(instruction),
            };
        case LockInstruction.UpdateVestingEscrowRecipient:
            return {
                instructionType,
                ...parseUpdateVestingEscrowRecipientInstruction(instruction),
            };
    }
}
