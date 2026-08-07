import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';

export const CLOSE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([163, 214, 191, 165, 245, 188, 17, 185]);

export interface CloseClaimStatusInstructionAccounts {
    campaign: Address;
    claimStatus: Address;
    closer: Address;
    claimant: Address;
}

export interface ParsedCloseClaimStatusInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        claimStatus: AccountMeta;
        closer: AccountMeta;
        claimant: AccountMeta;
    };
    data: {};
}

export function parseCloseClaimStatusInstruction(
    instruction: TransactionInstruction,
): ParsedCloseClaimStatusInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for CloseClaimStatus instruction');
    }
    if (!CLOSE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseClaimStatus instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            claimStatus: instruction.keys[1]!,
            closer: instruction.keys[2]!,
            claimant: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createCloseClaimStatusInstruction(
    accounts: CloseClaimStatusInstructionAccounts,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: false },
        { pubkey: accounts.claimStatus, isSigner: false, isWritable: true },
        { pubkey: accounts.closer, isSigner: true, isWritable: false },
        { pubkey: accounts.claimant, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_CLAIM_STATUS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
