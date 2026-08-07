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

export const PAUSE_USER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([18, 63, 43, 94, 239, 53, 101, 14]);

export interface PauseUserInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface PauseUserInstructionArgs {
    pauseSupply: boolean;
    pauseBorrow: boolean;
}

function getPauseUserInstructionDataEncoder(): Encoder<PauseUserInstructionArgs> {
    return getStructEncoder([
        ['pauseSupply', getBooleanEncoder()],
        ['pauseBorrow', getBooleanEncoder()],
    ]);
}

function getPauseUserInstructionDataDecoder(): Decoder<PauseUserInstructionArgs> {
    return getStructDecoder([
        ['pauseSupply', getBooleanDecoder()],
        ['pauseBorrow', getBooleanDecoder()],
    ]);
}

export interface ParsedPauseUserInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        position: AccountMeta;
    };
    data: PauseUserInstructionArgs;
}

export function parsePauseUserInstruction(instruction: TransactionInstruction): ParsedPauseUserInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for PauseUser instruction');
    }
    if (!PAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PauseUser instruction discriminator mismatch');
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
        data: getPauseUserInstructionDataDecoder().decode(instructionData),
    };
}

export function createPauseUserInstruction(
    accounts: PauseUserInstructionAccounts,
    args: PauseUserInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getPauseUserInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PAUSE_USER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
