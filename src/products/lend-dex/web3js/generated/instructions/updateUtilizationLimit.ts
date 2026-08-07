import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_UTILIZATION_LIMIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([48, 145, 0, 235, 118, 59, 55, 207]);

export interface UpdateUtilizationLimitInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateUtilizationLimitInstructionArgs {
    token0UtilizationLimit: number;
    token1UtilizationLimit: number;
}

function getUpdateUtilizationLimitInstructionDataEncoder(): Encoder<UpdateUtilizationLimitInstructionArgs> {
    return getStructEncoder([
        ['token0UtilizationLimit', getU16Encoder()],
        ['token1UtilizationLimit', getU16Encoder()],
    ]);
}

function getUpdateUtilizationLimitInstructionDataDecoder(): Decoder<UpdateUtilizationLimitInstructionArgs> {
    return getStructDecoder([
        ['token0UtilizationLimit', getU16Decoder()],
        ['token1UtilizationLimit', getU16Decoder()],
    ]);
}

export interface ParsedUpdateUtilizationLimitInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateUtilizationLimitInstructionArgs;
}

export function parseUpdateUtilizationLimitInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUtilizationLimitInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateUtilizationLimit instruction');
    }
    if (
        !UPDATE_UTILIZATION_LIMIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateUtilizationLimit instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateUtilizationLimitInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUtilizationLimitInstruction(
    accounts: UpdateUtilizationLimitInstructionAccounts,
    args: UpdateUtilizationLimitInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUtilizationLimitInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_UTILIZATION_LIMIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
