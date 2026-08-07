import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const CLOSE_LOST_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([235, 157, 191, 130, 227, 214, 104, 178]);

export interface CloseLostPositionInstructionAccounts {
    authority: Address;
    vault: Address;
    position: Address;
    marketResult: Address;
}

export interface ParsedCloseLostPositionInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vault: AccountMeta;
        position: AccountMeta;
        marketResult: AccountMeta;
    };
    data: {};
}

export function parseCloseLostPositionInstruction(
    instruction: TransactionInstruction,
): ParsedCloseLostPositionInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for CloseLostPosition instruction');
    }
    if (!CLOSE_LOST_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseLostPosition instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vault: instruction.keys[1]!,
            position: instruction.keys[2]!,
            marketResult: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createCloseLostPositionInstruction(
    accounts: CloseLostPositionInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_LOST_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
