import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const UNSTAKE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([90, 95, 107, 42, 205, 124, 50, 225]);

export interface UnstakeInstructionAccounts {
    operator: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    transferAuthority: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    clock: Address;
    stakeProgram: Address;
}

export interface ParsedUnstakeInstruction {
    programId: Address;
    accounts: {
        operator: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        transferAuthority: AccountMeta;
        stakeAccount: AccountMeta;
        stakeInfo: AccountMeta;
        clock: AccountMeta;
        stakeProgram: AccountMeta;
    };
    data: {};
}

export function parseUnstakeInstruction(instruction: TransactionInstruction): ParsedUnstakeInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for Unstake instruction');
    }
    if (!UNSTAKE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Unstake instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operator: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            transferAuthority: instruction.keys[4]!,
            stakeAccount: instruction.keys[5]!,
            stakeInfo: instruction.keys[6]!,
            clock: instruction.keys[7]!,
            stakeProgram: instruction.keys[8]!,
        },
        data: {},
    };
}

export function createUnstakeInstruction(
    accounts: UnstakeInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.clock, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UNSTAKE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
