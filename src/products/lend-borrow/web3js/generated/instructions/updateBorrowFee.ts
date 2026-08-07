import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_BORROW_FEE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([251, 124, 35, 148, 202, 167, 157, 65]);

export interface UpdateBorrowFeeInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateBorrowFeeInstructionArgs {
    vaultId: number;
    borrowFee: number;
}

function getUpdateBorrowFeeInstructionDataEncoder(): Encoder<UpdateBorrowFeeInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['borrowFee', getU8Encoder()],
    ]);
}

function getUpdateBorrowFeeInstructionDataDecoder(): Decoder<UpdateBorrowFeeInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['borrowFee', getU8Decoder()],
    ]);
}

export interface ParsedUpdateBorrowFeeInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateBorrowFeeInstructionArgs;
}

export function parseUpdateBorrowFeeInstruction(instruction: TransactionInstruction): ParsedUpdateBorrowFeeInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateBorrowFee instruction');
    }
    if (!UPDATE_BORROW_FEE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateBorrowFee instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultState: instruction.keys[2]!,
            vaultConfig: instruction.keys[3]!,
            supplyTokenReservesLiquidity: instruction.keys[4]!,
            borrowTokenReservesLiquidity: instruction.keys[5]!,
        },
        data: getUpdateBorrowFeeInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateBorrowFeeInstruction(
    accounts: UpdateBorrowFeeInstructionAccounts,
    args: UpdateBorrowFeeInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateBorrowFeeInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_BORROW_FEE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
