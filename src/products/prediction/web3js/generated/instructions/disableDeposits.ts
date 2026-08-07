import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const DISABLE_DEPOSITS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([214, 13, 103, 248, 66, 87, 164, 200]);

export interface DisableDepositsInstructionAccounts {
    authority: Address;
    vault: Address;
}

export interface ParsedDisableDepositsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vault: AccountMeta;
    };
    data: {};
}

export function parseDisableDepositsInstruction(instruction: TransactionInstruction): ParsedDisableDepositsInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for DisableDeposits instruction');
    }
    if (!DISABLE_DEPOSITS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('DisableDeposits instruction discriminator mismatch');
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

export function createDisableDepositsInstruction(
    accounts: DisableDepositsInstructionAccounts,
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
        Buffer.from(DISABLE_DEPOSITS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
