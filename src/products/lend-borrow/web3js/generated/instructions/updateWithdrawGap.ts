import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_WITHDRAW_GAP_INSTRUCTION_DISCRIMINATOR = new Uint8Array([229, 163, 76, 21, 82, 215, 25, 233]);

export interface UpdateWithdrawGapInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateWithdrawGapInstructionArgs {
    vaultId: number;
    withdrawGap: number;
}

function getUpdateWithdrawGapInstructionDataEncoder(): Encoder<UpdateWithdrawGapInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['withdrawGap', getU16Encoder()],
    ]);
}

function getUpdateWithdrawGapInstructionDataDecoder(): Decoder<UpdateWithdrawGapInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['withdrawGap', getU16Decoder()],
    ]);
}

export interface ParsedUpdateWithdrawGapInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateWithdrawGapInstructionArgs;
}

export function parseUpdateWithdrawGapInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateWithdrawGapInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateWithdrawGap instruction');
    }
    if (!UPDATE_WITHDRAW_GAP_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateWithdrawGap instruction discriminator mismatch');
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
        data: getUpdateWithdrawGapInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateWithdrawGapInstruction(
    accounts: UpdateWithdrawGapInstructionAccounts,
    args: UpdateWithdrawGapInstructionArgs,
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
    let data = Buffer.from(getUpdateWithdrawGapInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_WITHDRAW_GAP_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
