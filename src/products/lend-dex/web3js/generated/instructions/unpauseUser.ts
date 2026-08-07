import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([71, 115, 128, 252, 182, 126, 234, 62]);

export interface UnpauseUserInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UnpauseUserInstructionArgs {
    unpauseSupply: boolean;
    unpauseBorrow: boolean;
}

function getUnpauseUserInstructionDataEncoder(): Encoder<UnpauseUserInstructionArgs> {
    return getStructEncoder([
        ['unpauseSupply', getBooleanEncoder()],
        ['unpauseBorrow', getBooleanEncoder()],
    ]);
}

function getUnpauseUserInstructionDataDecoder(): Decoder<UnpauseUserInstructionArgs> {
    return getStructDecoder([
        ['unpauseSupply', getBooleanDecoder()],
        ['unpauseBorrow', getBooleanDecoder()],
    ]);
}

export interface ParsedUnpauseUserInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        position: AccountMeta;
    };
    data: UnpauseUserInstructionArgs;
}

export function parseUnpauseUserInstruction(instruction: TransactionInstruction): ParsedUnpauseUserInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for UnpauseUser instruction');
    }
    if (!UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UnpauseUser instruction discriminator mismatch');
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
        data: getUnpauseUserInstructionDataDecoder().decode(instructionData),
    };
}

export function createUnpauseUserInstruction(
    accounts: UnpauseUserInstructionAccounts,
    args: UnpauseUserInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUnpauseUserInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
