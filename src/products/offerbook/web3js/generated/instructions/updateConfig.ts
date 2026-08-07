import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';
import {
    getUpdateConfigActionDecoder,
    getUpdateConfigActionEncoder,
    type UpdateConfigActionArgs,
} from '../types/updateConfigAction';

export const UPDATE_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([29, 158, 252, 191, 10, 83, 219, 99]);

export interface UpdateConfigInstructionAccounts {
    admin: Address;
    config: Address;
}

export interface UpdateConfigInstructionArgs {
    action: UpdateConfigActionArgs;
}

function getUpdateConfigInstructionDataEncoder(): Encoder<UpdateConfigInstructionArgs> {
    return getStructEncoder([['action', getUpdateConfigActionEncoder()]]);
}

function getUpdateConfigInstructionDataDecoder(): Decoder<UpdateConfigInstructionArgs> {
    return getStructDecoder([['action', getUpdateConfigActionDecoder()]]);
}

export interface ParsedUpdateConfigInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        config: AccountMeta;
    };
    data: UpdateConfigInstructionArgs;
}

export function parseUpdateConfigInstruction(instruction: TransactionInstruction): ParsedUpdateConfigInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateConfig instruction');
    }
    if (!UPDATE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            config: instruction.keys[1]!,
        },
        data: getUpdateConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateConfigInstruction(
    accounts: UpdateConfigInstructionAccounts,
    args: UpdateConfigInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
