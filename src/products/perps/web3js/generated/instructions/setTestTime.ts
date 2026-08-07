import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SET_TEST_TIME_INSTRUCTION_DISCRIMINATOR = new Uint8Array([242, 231, 177, 251, 126, 145, 159, 104]);

export interface SetTestTimeInstructionAccounts {
    admin: Address;
    perpetuals: Address;
}

export interface SetTestTimeInstructionArgs {
    time: number | bigint;
}

function getSetTestTimeInstructionDataEncoder(): Encoder<SetTestTimeInstructionArgs> {
    return getStructEncoder([['time', getI64Encoder()]]);
}

function getSetTestTimeInstructionDataDecoder(): Decoder<SetTestTimeInstructionArgs> {
    return getStructDecoder([['time', getI64Decoder()]]);
}

export interface ParsedSetTestTimeInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        perpetuals: AccountMeta;
    };
    data: SetTestTimeInstructionArgs;
}

export function parseSetTestTimeInstruction(instruction: TransactionInstruction): ParsedSetTestTimeInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetTestTime instruction');
    }
    if (!SET_TEST_TIME_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetTestTime instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
        },
        data: getSetTestTimeInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetTestTimeInstruction(
    accounts: SetTestTimeInstructionAccounts,
    args: SetTestTimeInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSetTestTimeInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_TEST_TIME_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
