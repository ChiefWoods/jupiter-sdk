import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';

export const SET_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([251, 163, 0, 52, 91, 194, 187, 92]);

export interface SetAdminInstructionAccounts {
    campaign: Address;
    admin: Address;
    newAdmin: Address;
}

export interface ParsedSetAdminInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        admin: AccountMeta;
        newAdmin: AccountMeta;
    };
    data: {};
}

export function parseSetAdminInstruction(instruction: TransactionInstruction): ParsedSetAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SetAdmin instruction');
    }
    if (!SET_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            admin: instruction.keys[1]!,
            newAdmin: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createSetAdminInstruction(
    accounts: SetAdminInstructionAccounts,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.newAdmin, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
