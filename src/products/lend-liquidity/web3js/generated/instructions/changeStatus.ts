import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CHANGE_STATUS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([236, 145, 131, 228, 227, 17, 192, 255]);

export interface ChangeStatusInstructionAccounts {
    authority: Address;
    liquidity: Address;
    authList: Address;
}

export interface ChangeStatusInstructionArgs {
    status: boolean;
}

function getChangeStatusInstructionDataEncoder(): Encoder<ChangeStatusInstructionArgs> {
    return getStructEncoder([['status', getBooleanEncoder()]]);
}

function getChangeStatusInstructionDataDecoder(): Decoder<ChangeStatusInstructionArgs> {
    return getStructDecoder([['status', getBooleanDecoder()]]);
}

export interface ParsedChangeStatusInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        liquidity: AccountMeta;
        authList: AccountMeta;
    };
    data: ChangeStatusInstructionArgs;
}

export function parseChangeStatusInstruction(instruction: TransactionInstruction): ParsedChangeStatusInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for ChangeStatus instruction');
    }
    if (!CHANGE_STATUS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ChangeStatus instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            authList: instruction.keys[2]!,
        },
        data: getChangeStatusInstructionDataDecoder().decode(instructionData),
    };
}

export function createChangeStatusInstruction(
    accounts: ChangeStatusInstructionAccounts,
    args: ChangeStatusInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getChangeStatusInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CHANGE_STATUS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
