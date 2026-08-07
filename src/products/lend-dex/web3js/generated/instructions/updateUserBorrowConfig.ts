import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    100, 176, 201, 174, 247, 2, 54, 168,
]);

export interface UpdateUserBorrowConfigInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserBorrowConfigInstructionArgs {
    expandPercent: number;
    expandDuration: number;
    baseDebtCeiling: number | bigint;
    maxDebtCeiling: number | bigint;
}

function getUpdateUserBorrowConfigInstructionDataEncoder(): Encoder<UpdateUserBorrowConfigInstructionArgs> {
    return getStructEncoder([
        ['expandPercent', getU16Encoder()],
        ['expandDuration', getU32Encoder()],
        ['baseDebtCeiling', getU64Encoder()],
        ['maxDebtCeiling', getU64Encoder()],
    ]);
}

function getUpdateUserBorrowConfigInstructionDataDecoder(): Decoder<UpdateUserBorrowConfigInstructionArgs> {
    return getStructDecoder([
        ['expandPercent', getU16Decoder()],
        ['expandDuration', getU32Decoder()],
        ['baseDebtCeiling', getU64Decoder()],
        ['maxDebtCeiling', getU64Decoder()],
    ]);
}

export interface ParsedUpdateUserBorrowConfigInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        position: AccountMeta;
    };
    data: UpdateUserBorrowConfigInstructionArgs;
}

export function parseUpdateUserBorrowConfigInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUserBorrowConfigInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for UpdateUserBorrowConfig instruction');
    }
    if (
        !UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateUserBorrowConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
            position: instruction.keys[3]!,
        },
        data: getUpdateUserBorrowConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserBorrowConfigInstruction(
    accounts: UpdateUserBorrowConfigInstructionAccounts,
    args: UpdateUserBorrowConfigInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUserBorrowConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
