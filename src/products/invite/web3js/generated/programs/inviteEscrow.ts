import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CLAIM_INSTRUCTION_DISCRIMINATOR,
    parseClaimInstruction,
    type ParsedClaimInstruction,
} from '../instructions/claim';
import {
    CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseClaimTokenInstruction,
    type ParsedClaimTokenInstruction,
} from '../instructions/claimToken';
import {
    CLAWBACK_INSTRUCTION_DISCRIMINATOR,
    parseClawbackInstruction,
    type ParsedClawbackInstruction,
} from '../instructions/clawback';
import {
    CLAWBACK_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseClawbackTokenInstruction,
    type ParsedClawbackTokenInstruction,
} from '../instructions/clawbackToken';
import {
    EXPIRE_INSTRUCTION_DISCRIMINATOR,
    parseExpireInstruction,
    type ParsedExpireInstruction,
} from '../instructions/expire';
import {
    EXPIRE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseExpireTokenInstruction,
    type ParsedExpireTokenInstruction,
} from '../instructions/expireToken';
import {
    INITIALIZE_INSTRUCTION_DISCRIMINATOR,
    parseInitializeInstruction,
    type ParsedInitializeInstruction,
} from '../instructions/initialize';
import {
    INITIALIZE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseInitializeTokenInstruction,
    type ParsedInitializeTokenInstruction,
} from '../instructions/initializeToken';
import { INVITE_INFO_ACCOUNT_DISCRIMINATOR } from '../accounts/inviteInfo';
import { INVITE_INFO_TOKEN_ACCOUNT_DISCRIMINATOR } from '../accounts/inviteInfoToken';

export const INVITEESCROW_PROGRAM_ID = new Address('inv1tEtSwRMtM44tbvJGNiTxMvDfPVnX9StyqXfDfks');
export const INVITE_ESCROW_PROGRAM_ADDRESS = INVITEESCROW_PROGRAM_ID;

export interface InviteEscrowProgram {
    name: 'inviteEscrow';
    programId: Address;
}

export function getInviteEscrowProgram(programId: Address = INVITEESCROW_PROGRAM_ID): InviteEscrowProgram {
    return { name: 'inviteEscrow', programId };
}

export enum InviteEscrowAccount {
    InviteInfo,
    InviteInfoToken,
}

export function identifyInviteEscrowAccount(account: { data: Uint8Array } | Uint8Array): InviteEscrowAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (INVITE_INFO_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowAccount.InviteInfo;
    if (INVITE_INFO_TOKEN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowAccount.InviteInfoToken;
    throw new Error('Failed to identify InviteEscrow account');
}

export enum InviteEscrowInstruction {
    Initialize,
    Claim,
    Clawback,
    Expire,
    InitializeToken,
    ClaimToken,
    ClawbackToken,
    ExpireToken,
}

export function identifyInviteEscrowInstruction(
    instruction: { data: Uint8Array } | Uint8Array,
): InviteEscrowInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (INITIALIZE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.Initialize;
    if (CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.Claim;
    if (CLAWBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.Clawback;
    if (EXPIRE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.Expire;
    if (INITIALIZE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.InitializeToken;
    if (CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.ClaimToken;
    if (CLAWBACK_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.ClawbackToken;
    if (EXPIRE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return InviteEscrowInstruction.ExpireToken;
    throw new Error('Failed to identify InviteEscrow instruction');
}

export type ParsedInviteEscrowInstruction =
    | ({ instructionType: InviteEscrowInstruction.Initialize } & ParsedInitializeInstruction)
    | ({ instructionType: InviteEscrowInstruction.Claim } & ParsedClaimInstruction)
    | ({ instructionType: InviteEscrowInstruction.Clawback } & ParsedClawbackInstruction)
    | ({ instructionType: InviteEscrowInstruction.Expire } & ParsedExpireInstruction)
    | ({ instructionType: InviteEscrowInstruction.InitializeToken } & ParsedInitializeTokenInstruction)
    | ({ instructionType: InviteEscrowInstruction.ClaimToken } & ParsedClaimTokenInstruction)
    | ({ instructionType: InviteEscrowInstruction.ClawbackToken } & ParsedClawbackTokenInstruction)
    | ({ instructionType: InviteEscrowInstruction.ExpireToken } & ParsedExpireTokenInstruction);

export function parseInviteEscrowInstruction(instruction: TransactionInstruction): ParsedInviteEscrowInstruction {
    const instructionType = identifyInviteEscrowInstruction(instruction);
    switch (instructionType) {
        case InviteEscrowInstruction.Initialize:
            return {
                instructionType,
                ...parseInitializeInstruction(instruction),
            };
        case InviteEscrowInstruction.Claim:
            return {
                instructionType,
                ...parseClaimInstruction(instruction),
            };
        case InviteEscrowInstruction.Clawback:
            return {
                instructionType,
                ...parseClawbackInstruction(instruction),
            };
        case InviteEscrowInstruction.Expire:
            return {
                instructionType,
                ...parseExpireInstruction(instruction),
            };
        case InviteEscrowInstruction.InitializeToken:
            return {
                instructionType,
                ...parseInitializeTokenInstruction(instruction),
            };
        case InviteEscrowInstruction.ClaimToken:
            return {
                instructionType,
                ...parseClaimTokenInstruction(instruction),
            };
        case InviteEscrowInstruction.ClawbackToken:
            return {
                instructionType,
                ...parseClawbackTokenInstruction(instruction),
            };
        case InviteEscrowInstruction.ExpireToken:
            return {
                instructionType,
                ...parseExpireTokenInstruction(instruction),
            };
    }
}
