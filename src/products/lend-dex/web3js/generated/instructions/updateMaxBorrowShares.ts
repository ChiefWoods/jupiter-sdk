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

export const UPDATE_MAX_BORROW_SHARES_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    176, 13, 121, 189, 225, 225, 238, 78,
]);

export interface UpdateMaxBorrowSharesInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateMaxBorrowSharesInstructionArgs {
    maxBorrowShares: number | bigint;
}

function getUpdateMaxBorrowSharesInstructionDataEncoder(): Encoder<UpdateMaxBorrowSharesInstructionArgs> {
    return getStructEncoder([['maxBorrowShares', getU64Encoder()]]);
}

function getUpdateMaxBorrowSharesInstructionDataDecoder(): Decoder<UpdateMaxBorrowSharesInstructionArgs> {
    return getStructDecoder([['maxBorrowShares', getU64Decoder()]]);
}

export interface ParsedUpdateMaxBorrowSharesInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateMaxBorrowSharesInstructionArgs;
}

export function parseUpdateMaxBorrowSharesInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateMaxBorrowSharesInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateMaxBorrowShares instruction');
    }
    if (
        !UPDATE_MAX_BORROW_SHARES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateMaxBorrowShares instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateMaxBorrowSharesInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateMaxBorrowSharesInstruction(
    accounts: UpdateMaxBorrowSharesInstructionAccounts,
    args: UpdateMaxBorrowSharesInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateMaxBorrowSharesInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_MAX_BORROW_SHARES_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
