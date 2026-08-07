import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const CLOSE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([204, 226, 145, 205, 232, 37, 3, 140]);

export interface CloseBorrowPositionInstructionAccounts {
    owner: Address;
    borrowPosition: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedCloseBorrowPositionInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        borrowPosition: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseCloseBorrowPositionInstruction(
    instruction: TransactionInstruction,
): ParsedCloseBorrowPositionInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for CloseBorrowPosition instruction');
    }
    if (!CLOSE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseBorrowPosition instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            borrowPosition: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
            eventAuthority: instruction.keys[3]!,
            program: instruction.keys[4]!,
        },
        data: {},
    };
}

export function createCloseBorrowPositionInstruction(
    accounts: CloseBorrowPositionInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
