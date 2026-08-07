import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const REALLOC_POOL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([114, 128, 37, 167, 71, 227, 40, 178]);

export interface ReallocPoolInstructionAccounts {
    keeper: Address;
    pool: Address;
    systemProgram: Address;
    rent: Address;
}

export interface ParsedReallocPoolInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        pool: AccountMeta;
        systemProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: {};
}

export function parseReallocPoolInstruction(instruction: TransactionInstruction): ParsedReallocPoolInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for ReallocPool instruction');
    }
    if (!REALLOC_POOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ReallocPool instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            pool: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
            rent: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createReallocPoolInstruction(
    accounts: ReallocPoolInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REALLOC_POOL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
