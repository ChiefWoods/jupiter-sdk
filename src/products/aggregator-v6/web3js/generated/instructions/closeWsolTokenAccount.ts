import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';

export const CLOSE_WSOL_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    203, 129, 103, 133, 197, 125, 107, 86,
]);

export interface CloseWsolTokenAccountInstructionAccounts {
    tokenAccount: Address;
    user: Address;
    tokenProgram: Address;
    systemProgram: Address;
}

export interface ParsedCloseWsolTokenAccountInstruction {
    programId: Address;
    accounts: {
        tokenAccount: AccountMeta;
        user: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseCloseWsolTokenAccountInstruction(
    instruction: TransactionInstruction,
): ParsedCloseWsolTokenAccountInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for CloseWsolTokenAccount instruction');
    }
    if (
        !CLOSE_WSOL_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('CloseWsolTokenAccount instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenAccount: instruction.keys[0]!,
            user: instruction.keys[1]!,
            tokenProgram: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createCloseWsolTokenAccountInstruction(
    accounts: CloseWsolTokenAccountInstructionAccounts,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_WSOL_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
