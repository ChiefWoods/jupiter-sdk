import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const SET_MAX_GLOBAL_SIZES_INSTRUCTION_DISCRIMINATOR = new Uint8Array([89, 2, 210, 24, 167, 227, 13, 214]);

export interface SetMaxGlobalSizesInstructionAccounts {
    keeper: Address;
    custody: Address;
    pool: Address;
}

export interface SetMaxGlobalSizesInstructionArgs {
    maxGlobalLongSize: number | bigint;
    maxGlobalShortSize: number | bigint;
    recoveryId: number;
    signature: ReadonlyUint8Array;
    referenceId: ReadonlyUint8Array;
    timestamp: number | bigint;
}

function getSetMaxGlobalSizesInstructionDataEncoder(): Encoder<SetMaxGlobalSizesInstructionArgs> {
    return getStructEncoder([
        ['maxGlobalLongSize', getU64Encoder()],
        ['maxGlobalShortSize', getU64Encoder()],
        ['recoveryId', getU8Encoder()],
        ['signature', fixEncoderSize(getBytesEncoder(), 64)],
        ['referenceId', fixEncoderSize(getBytesEncoder(), 16)],
        ['timestamp', getU64Encoder()],
    ]);
}

function getSetMaxGlobalSizesInstructionDataDecoder(): Decoder<SetMaxGlobalSizesInstructionArgs> {
    return getStructDecoder([
        ['maxGlobalLongSize', getU64Decoder()],
        ['maxGlobalShortSize', getU64Decoder()],
        ['recoveryId', getU8Decoder()],
        ['signature', fixDecoderSize(getBytesDecoder(), 64)],
        ['referenceId', fixDecoderSize(getBytesDecoder(), 16)],
        ['timestamp', getU64Decoder()],
    ]);
}

export interface ParsedSetMaxGlobalSizesInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        custody: AccountMeta;
        pool: AccountMeta;
    };
    data: SetMaxGlobalSizesInstructionArgs;
}

export function parseSetMaxGlobalSizesInstruction(
    instruction: TransactionInstruction,
): ParsedSetMaxGlobalSizesInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SetMaxGlobalSizes instruction');
    }
    if (!SET_MAX_GLOBAL_SIZES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetMaxGlobalSizes instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            custody: instruction.keys[1]!,
            pool: instruction.keys[2]!,
        },
        data: getSetMaxGlobalSizesInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetMaxGlobalSizesInstruction(
    accounts: SetMaxGlobalSizesInstructionAccounts,
    args: SetMaxGlobalSizesInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getSetMaxGlobalSizesInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_MAX_GLOBAL_SIZES_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
