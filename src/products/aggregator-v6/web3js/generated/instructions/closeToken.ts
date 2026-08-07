import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CLOSE_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([26, 74, 236, 151, 104, 64, 183, 249]);

export interface CloseTokenInstructionAccounts {
    operator: Address;
    wallet: Address;
    programAuthority: Address;
    programTokenAccount: Address;
    mint: Address;
    tokenProgram: Address;
}

export interface CloseTokenInstructionArgs {
    id: number;
    burnAll: boolean;
}

function getCloseTokenInstructionDataEncoder(): Encoder<CloseTokenInstructionArgs> {
    return getStructEncoder([
        ['id', getU8Encoder()],
        ['burnAll', getBooleanEncoder()],
    ]);
}

function getCloseTokenInstructionDataDecoder(): Decoder<CloseTokenInstructionArgs> {
    return getStructDecoder([
        ['id', getU8Decoder()],
        ['burnAll', getBooleanDecoder()],
    ]);
}

export interface ParsedCloseTokenInstruction {
    programId: Address;
    accounts: {
        operator: AccountMeta;
        wallet: AccountMeta;
        programAuthority: AccountMeta;
        programTokenAccount: AccountMeta;
        mint: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: CloseTokenInstructionArgs;
}

export function parseCloseTokenInstruction(instruction: TransactionInstruction): ParsedCloseTokenInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for CloseToken instruction');
    }
    if (!CLOSE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operator: instruction.keys[0]!,
            wallet: instruction.keys[1]!,
            programAuthority: instruction.keys[2]!,
            programTokenAccount: instruction.keys[3]!,
            mint: instruction.keys[4]!,
            tokenProgram: instruction.keys[5]!,
        },
        data: getCloseTokenInstructionDataDecoder().decode(instructionData),
    };
}

export function createCloseTokenInstruction(
    accounts: CloseTokenInstructionAccounts,
    args: CloseTokenInstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.wallet, isSigner: false, isWritable: true },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.programTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCloseTokenInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
