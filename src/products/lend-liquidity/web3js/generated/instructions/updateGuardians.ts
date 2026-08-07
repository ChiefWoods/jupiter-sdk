import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { getAddressBoolDecoder, getAddressBoolEncoder, type AddressBoolArgs } from '../types/addressBool';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([43, 62, 250, 138, 141, 117, 132, 97]);

export interface UpdateGuardiansInstructionAccounts {
    authority: Address;
    liquidity: Address;
    authList: Address;
}

export interface UpdateGuardiansInstructionArgs {
    guardianStatus: Array<AddressBoolArgs>;
}

function getUpdateGuardiansInstructionDataEncoder(): Encoder<UpdateGuardiansInstructionArgs> {
    return getStructEncoder([['guardianStatus', getArrayEncoder(getAddressBoolEncoder())]]);
}

function getUpdateGuardiansInstructionDataDecoder(): Decoder<UpdateGuardiansInstructionArgs> {
    return getStructDecoder([['guardianStatus', getArrayDecoder(getAddressBoolDecoder())]]);
}

export interface ParsedUpdateGuardiansInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        liquidity: AccountMeta;
        authList: AccountMeta;
    };
    data: UpdateGuardiansInstructionArgs;
}

export function parseUpdateGuardiansInstruction(instruction: TransactionInstruction): ParsedUpdateGuardiansInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateGuardians instruction');
    }
    if (!UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateGuardians instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            authList: instruction.keys[2]!,
        },
        data: getUpdateGuardiansInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateGuardiansInstruction(
    accounts: UpdateGuardiansInstructionAccounts,
    args: UpdateGuardiansInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateGuardiansInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
