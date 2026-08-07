import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { getAddressU8Decoder, getAddressU8Encoder, type AddressU8Args } from '../types/addressU8';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_USER_CLASS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([12, 206, 68, 135, 63, 212, 48, 119]);

export interface UpdateUserClassInstructionAccounts {
    authority: Address;
    authList: Address;
}

export interface UpdateUserClassInstructionArgs {
    userClass: Array<AddressU8Args>;
}

function getUpdateUserClassInstructionDataEncoder(): Encoder<UpdateUserClassInstructionArgs> {
    return getStructEncoder([['userClass', getArrayEncoder(getAddressU8Encoder())]]);
}

function getUpdateUserClassInstructionDataDecoder(): Decoder<UpdateUserClassInstructionArgs> {
    return getStructDecoder([['userClass', getArrayDecoder(getAddressU8Decoder())]]);
}

export interface ParsedUpdateUserClassInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
    };
    data: UpdateUserClassInstructionArgs;
}

export function parseUpdateUserClassInstruction(instruction: TransactionInstruction): ParsedUpdateUserClassInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateUserClass instruction');
    }
    if (!UPDATE_USER_CLASS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateUserClass instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
        },
        data: getUpdateUserClassInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserClassInstruction(
    accounts: UpdateUserClassInstructionAccounts,
    args: UpdateUserClassInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUserClassInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_USER_CLASS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
