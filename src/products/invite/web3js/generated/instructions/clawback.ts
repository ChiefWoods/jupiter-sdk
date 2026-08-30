import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';

export const CLAWBACK_INSTRUCTION_DISCRIMINATOR = new Uint8Array([111, 92, 142, 79, 33, 234, 82, 27]);

export interface ClawbackInstructionAccounts {
    inviteInfo: Address;
    sender: Address;
}

export interface ParsedClawbackInstruction {
    programId: Address;
    accounts: {
        inviteInfo: AccountMeta;
        sender: AccountMeta;
    };
    data: {};
}

export function parseClawbackInstruction(instruction: TransactionInstruction): ParsedClawbackInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for Clawback instruction');
    }
    if (!CLAWBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Clawback instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            inviteInfo: instruction.keys[0]!,
            sender: instruction.keys[1]!,
        },
        data: {},
    };
}

export function createClawbackInstruction(
    accounts: ClawbackInstructionAccounts,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
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
