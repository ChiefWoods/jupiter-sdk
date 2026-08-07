import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    162, 9, 186, 9, 213, 30, 173, 78,
]);

export interface UpdateUserWithdrawalLimitInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserWithdrawalLimitInstructionArgs {
    newLimit: number | bigint;
}

function getUpdateUserWithdrawalLimitInstructionDataEncoder(): Encoder<UpdateUserWithdrawalLimitInstructionArgs> {
    return getStructEncoder([['newLimit', getU64Encoder()]]);
}

function getUpdateUserWithdrawalLimitInstructionDataDecoder(): Decoder<UpdateUserWithdrawalLimitInstructionArgs> {
    return getStructDecoder([['newLimit', getU64Decoder()]]);
}

export interface ParsedUpdateUserWithdrawalLimitInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        position: AccountMeta;
    };
    data: UpdateUserWithdrawalLimitInstructionArgs;
}

export function parseUpdateUserWithdrawalLimitInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUserWithdrawalLimitInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for UpdateUserWithdrawalLimit instruction');
    }
    if (
        !UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateUserWithdrawalLimit instruction discriminator mismatch');
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
        data: getUpdateUserWithdrawalLimitInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserWithdrawalLimitInstruction(
    accounts: UpdateUserWithdrawalLimitInstructionAccounts,
    args: UpdateUserWithdrawalLimitInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUserWithdrawalLimitInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
