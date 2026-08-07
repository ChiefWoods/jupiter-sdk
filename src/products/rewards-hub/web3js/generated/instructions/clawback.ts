import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';

export const CLAWBACK_INSTRUCTION_DISCRIMINATOR = new Uint8Array([111, 92, 142, 79, 33, 234, 82, 27]);

export interface ClawbackInstructionAccounts {
    campaign: Address;
    from: Address;
    to: Address;
    admin: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface ParsedClawbackInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        from: AccountMeta;
        to: AccountMeta;
        admin: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseClawbackInstruction(instruction: TransactionInstruction): ParsedClawbackInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for Clawback instruction');
    }
    if (!CLAWBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Clawback instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            from: instruction.keys[1]!,
            to: instruction.keys[2]!,
            admin: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
            tokenProgram: instruction.keys[5]!,
        },
        data: {},
    };
}

export function createClawbackInstruction(
    accounts: ClawbackInstructionAccounts,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: false },
        { pubkey: accounts.from, isSigner: false, isWritable: true },
        { pubkey: accounts.to, isSigner: false, isWritable: true },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAWBACK_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
