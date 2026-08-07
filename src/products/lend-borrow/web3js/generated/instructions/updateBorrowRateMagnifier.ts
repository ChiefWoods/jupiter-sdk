import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getI16Decoder,
    getI16Encoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_BORROW_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    75, 250, 27, 176, 156, 53, 26, 112,
]);

export interface UpdateBorrowRateMagnifierInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateBorrowRateMagnifierInstructionArgs {
    vaultId: number;
    borrowRateMagnifier: number;
}

function getUpdateBorrowRateMagnifierInstructionDataEncoder(): Encoder<UpdateBorrowRateMagnifierInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['borrowRateMagnifier', getI16Encoder()],
    ]);
}

function getUpdateBorrowRateMagnifierInstructionDataDecoder(): Decoder<UpdateBorrowRateMagnifierInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['borrowRateMagnifier', getI16Decoder()],
    ]);
}

export interface ParsedUpdateBorrowRateMagnifierInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateBorrowRateMagnifierInstructionArgs;
}

export function parseUpdateBorrowRateMagnifierInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateBorrowRateMagnifierInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateBorrowRateMagnifier instruction');
    }
    if (
        !UPDATE_BORROW_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateBorrowRateMagnifier instruction discriminator mismatch');
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
        data: getUpdateBorrowRateMagnifierInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateBorrowRateMagnifierInstruction(
    accounts: UpdateBorrowRateMagnifierInstructionAccounts,
    args: UpdateBorrowRateMagnifierInstructionArgs,
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
    let data = Buffer.from(getUpdateBorrowRateMagnifierInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_BORROW_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
