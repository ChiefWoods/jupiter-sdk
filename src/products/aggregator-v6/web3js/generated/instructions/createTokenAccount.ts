import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([147, 241, 123, 100, 244, 132, 174, 118]);

export interface CreateTokenAccountInstructionAccounts {
    tokenAccount: Address;
    user: Address;
    mint: Address;
    tokenProgram: Address;
    systemProgram: Address;
}

export interface CreateTokenAccountInstructionArgs {
    bump: number;
}

function getCreateTokenAccountInstructionDataEncoder(): Encoder<CreateTokenAccountInstructionArgs> {
    return getStructEncoder([['bump', getU8Encoder()]]);
}

function getCreateTokenAccountInstructionDataDecoder(): Decoder<CreateTokenAccountInstructionArgs> {
    return getStructDecoder([['bump', getU8Decoder()]]);
}

export interface ParsedCreateTokenAccountInstruction {
    programId: Address;
    accounts: {
        tokenAccount: AccountMeta;
        user: AccountMeta;
        mint: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateTokenAccountInstructionArgs;
}

export function parseCreateTokenAccountInstruction(
    instruction: TransactionInstruction,
): ParsedCreateTokenAccountInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for CreateTokenAccount instruction');
    }
    if (!CREATE_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateTokenAccount instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenAccount: instruction.keys[0]!,
            user: instruction.keys[1]!,
            mint: instruction.keys[2]!,
            tokenProgram: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: getCreateTokenAccountInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateTokenAccountInstruction(
    accounts: CreateTokenAccountInstructionAccounts,
    args: CreateTokenAccountInstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateTokenAccountInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
