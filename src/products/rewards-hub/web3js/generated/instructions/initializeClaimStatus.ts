import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';
import { findClaimStatusPda } from '../pdas/claimStatus';

export const INITIALIZE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([133, 6, 250, 212, 133, 145, 69, 136]);

export interface InitializeClaimStatusInstructionAccounts {
    campaign: Address;
    claimStatus?: Address;
    claimant: Address;
    systemProgram: Address;
}

export interface ParsedInitializeClaimStatusInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        claimStatus: AccountMeta;
        claimant: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseInitializeClaimStatusInstruction(
    instruction: TransactionInstruction,
): ParsedInitializeClaimStatusInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitializeClaimStatus instruction');
    }
    if (
        !INITIALIZE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('InitializeClaimStatus instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            claimStatus: instruction.keys[1]!,
            claimant: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: {},
    };
}

export async function createInitializeClaimStatusInstruction(
    accounts: InitializeClaimStatusInstructionAccounts,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let claimStatus = accounts.claimStatus;
    if (!claimStatus) {
        const [derived] = await findClaimStatusPda(
            {
                claimant: accounts.claimant,
                campaign: accounts.campaign,
            },
            programId,
        );
        claimStatus = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: claimStatus, isSigner: false, isWritable: true },
        { pubkey: accounts.claimant, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INITIALIZE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
