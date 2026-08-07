import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const CLOSE_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([123, 134, 81, 0, 49, 68, 98, 98]);

export interface ClosePositionInstructionAccounts {
    authority: Address;
    owner: Address;
    position: Address;
    rentDestination: Address;
}

export interface ParsedClosePositionInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        owner: AccountMeta;
        position: AccountMeta;
        rentDestination: AccountMeta;
    };
    data: {};
}

export function parseClosePositionInstruction(instruction: TransactionInstruction): ParsedClosePositionInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for ClosePosition instruction');
    }
    if (!CLOSE_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClosePosition instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            position: instruction.keys[2]!,
            rentDestination: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createClosePositionInstruction(
    accounts: ClosePositionInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.rentDestination, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
