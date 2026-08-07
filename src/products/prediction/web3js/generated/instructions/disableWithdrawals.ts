import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const DISABLE_WITHDRAWALS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([150, 136, 206, 120, 173, 230, 137, 209]);

export interface DisableWithdrawalsInstructionAccounts {
    authority: Address;
    vault: Address;
}

export interface ParsedDisableWithdrawalsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vault: AccountMeta;
    };
    data: {};
}

export function parseDisableWithdrawalsInstruction(
    instruction: TransactionInstruction,
): ParsedDisableWithdrawalsInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for DisableWithdrawals instruction');
    }
    if (!DISABLE_WITHDRAWALS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('DisableWithdrawals instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vault: instruction.keys[1]!,
        },
        data: {},
    };
}

export function createDisableWithdrawalsInstruction(
    accounts: DisableWithdrawalsInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(DISABLE_WITHDRAWALS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
