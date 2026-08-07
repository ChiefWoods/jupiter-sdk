import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';
import { getAddressBoolDecoder, getAddressBoolEncoder, type AddressBoolArgs } from '../types/addressBool';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([93, 96, 178, 156, 57, 117, 253, 209]);

export interface UpdateAuthsInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
}

export interface UpdateAuthsInstructionArgs {
    authStatus: Array<AddressBoolArgs>;
}

function getUpdateAuthsInstructionDataEncoder(): Encoder<UpdateAuthsInstructionArgs> {
    return getStructEncoder([['authStatus', getArrayEncoder(getAddressBoolEncoder())]]);
}

function getUpdateAuthsInstructionDataDecoder(): Decoder<UpdateAuthsInstructionArgs> {
    return getStructDecoder([['authStatus', getArrayDecoder(getAddressBoolDecoder())]]);
}

export interface ParsedUpdateAuthsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        lendingRewardsAdmin: AccountMeta;
    };
    data: UpdateAuthsInstructionArgs;
}

export function parseUpdateAuthsInstruction(instruction: TransactionInstruction): ParsedUpdateAuthsInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateAuths instruction');
    }
    if (!UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateAuths instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            lendingRewardsAdmin: instruction.keys[1]!,
        },
        data: getUpdateAuthsInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateAuthsInstruction(
    accounts: UpdateAuthsInstructionAccounts,
    args: UpdateAuthsInstructionArgs,
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateAuthsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
