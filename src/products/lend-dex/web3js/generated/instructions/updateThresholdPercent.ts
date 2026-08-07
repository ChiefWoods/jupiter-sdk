import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_THRESHOLD_PERCENT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    177, 125, 99, 134, 42, 254, 140, 234,
]);

export interface UpdateThresholdPercentInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateThresholdPercentInstructionArgs {
    upperThresholdPercent: number;
    lowerThresholdPercent: number;
    thresholdShiftTime: number;
    shiftTime: number;
}

function getUpdateThresholdPercentInstructionDataEncoder(): Encoder<UpdateThresholdPercentInstructionArgs> {
    return getStructEncoder([
        ['upperThresholdPercent', getU32Encoder()],
        ['lowerThresholdPercent', getU32Encoder()],
        ['thresholdShiftTime', getU32Encoder()],
        ['shiftTime', getU32Encoder()],
    ]);
}

function getUpdateThresholdPercentInstructionDataDecoder(): Decoder<UpdateThresholdPercentInstructionArgs> {
    return getStructDecoder([
        ['upperThresholdPercent', getU32Decoder()],
        ['lowerThresholdPercent', getU32Decoder()],
        ['thresholdShiftTime', getU32Decoder()],
        ['shiftTime', getU32Decoder()],
    ]);
}

export interface ParsedUpdateThresholdPercentInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateThresholdPercentInstructionArgs;
}

export function parseUpdateThresholdPercentInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateThresholdPercentInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateThresholdPercent instruction');
    }
    if (
        !UPDATE_THRESHOLD_PERCENT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateThresholdPercent instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateThresholdPercentInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateThresholdPercentInstruction(
    accounts: UpdateThresholdPercentInstructionAccounts,
    args: UpdateThresholdPercentInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateThresholdPercentInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_THRESHOLD_PERCENT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
