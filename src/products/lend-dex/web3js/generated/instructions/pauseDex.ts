import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';

export const PAUSE_DEX_INSTRUCTION_DISCRIMINATOR = new Uint8Array([138, 255, 101, 0, 116, 202, 128, 100]);

export interface PauseDexInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface ParsedPauseDexInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: {};
}

export function parsePauseDexInstruction(instruction: TransactionInstruction): ParsedPauseDexInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for PauseDex instruction');
    }
    if (!PAUSE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PauseDex instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createPauseDexInstruction(
    accounts: PauseDexInstructionAccounts,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PAUSE_DEX_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
