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

export const UPDATE_RANGE_PERCENTS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([51, 233, 228, 43, 91, 7, 62, 20]);

export interface UpdateRangePercentsInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateRangePercentsInstructionArgs {
    upperPercent: number;
    lowerPercent: number;
    shiftTime: number;
}

function getUpdateRangePercentsInstructionDataEncoder(): Encoder<UpdateRangePercentsInstructionArgs> {
    return getStructEncoder([
        ['upperPercent', getU32Encoder()],
        ['lowerPercent', getU32Encoder()],
        ['shiftTime', getU32Encoder()],
    ]);
}

function getUpdateRangePercentsInstructionDataDecoder(): Decoder<UpdateRangePercentsInstructionArgs> {
    return getStructDecoder([
        ['upperPercent', getU32Decoder()],
        ['lowerPercent', getU32Decoder()],
        ['shiftTime', getU32Decoder()],
    ]);
}

export interface ParsedUpdateRangePercentsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateRangePercentsInstructionArgs;
}

export function parseUpdateRangePercentsInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateRangePercentsInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateRangePercents instruction');
    }
    if (!UPDATE_RANGE_PERCENTS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateRangePercents instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateRangePercentsInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateRangePercentsInstruction(
    accounts: UpdateRangePercentsInstructionAccounts,
    args: UpdateRangePercentsInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateRangePercentsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_RANGE_PERCENTS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
