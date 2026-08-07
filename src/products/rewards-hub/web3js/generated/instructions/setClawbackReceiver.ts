import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';

export const SET_CLAWBACK_RECEIVER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([153, 217, 34, 20, 19, 29, 229, 75]);

export interface SetClawbackReceiverInstructionAccounts {
    campaign: Address;
    newClawbackAccount: Address;
    admin: Address;
}

export interface ParsedSetClawbackReceiverInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        newClawbackAccount: AccountMeta;
        admin: AccountMeta;
    };
    data: {};
}

export function parseSetClawbackReceiverInstruction(
    instruction: TransactionInstruction,
): ParsedSetClawbackReceiverInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SetClawbackReceiver instruction');
    }
    if (!SET_CLAWBACK_RECEIVER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetClawbackReceiver instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            newClawbackAccount: instruction.keys[1]!,
            admin: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createSetClawbackReceiverInstruction(
    accounts: SetClawbackReceiverInstructionAccounts,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.newClawbackAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_CLAWBACK_RECEIVER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
