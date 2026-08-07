import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';
import {
    getUserBorrowConfigDecoder,
    getUserBorrowConfigEncoder,
    type UserBorrowConfigArgs,
} from '../types/userBorrowConfig';

export const UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    100, 176, 201, 174, 247, 2, 54, 168,
]);

export interface UpdateUserBorrowConfigInstructionAccounts {
    authority: Address;
    protocol: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
    userBorrowPosition: Address;
}

export interface UpdateUserBorrowConfigInstructionArgs {
    userBorrowConfig: UserBorrowConfigArgs;
}

function getUpdateUserBorrowConfigInstructionDataEncoder(): Encoder<UpdateUserBorrowConfigInstructionArgs> {
    return getStructEncoder([['userBorrowConfig', getUserBorrowConfigEncoder()]]);
}

function getUpdateUserBorrowConfigInstructionDataDecoder(): Decoder<UpdateUserBorrowConfigInstructionArgs> {
    return getStructDecoder([['userBorrowConfig', getUserBorrowConfigDecoder()]]);
}

export interface ParsedUpdateUserBorrowConfigInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        protocol: AccountMeta;
        authList: AccountMeta;
        rateModel: AccountMeta;
        mint: AccountMeta;
        tokenReserve: AccountMeta;
        userBorrowPosition: AccountMeta;
    };
    data: UpdateUserBorrowConfigInstructionArgs;
}

export function parseUpdateUserBorrowConfigInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUserBorrowConfigInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for UpdateUserBorrowConfig instruction');
    }
    if (
        !UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateUserBorrowConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            protocol: instruction.keys[1]!,
            authList: instruction.keys[2]!,
            rateModel: instruction.keys[3]!,
            mint: instruction.keys[4]!,
            tokenReserve: instruction.keys[5]!,
            userBorrowPosition: instruction.keys[6]!,
        },
        data: getUpdateUserBorrowConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserBorrowConfigInstruction(
    accounts: UpdateUserBorrowConfigInstructionAccounts,
    args: UpdateUserBorrowConfigInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.protocol, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUserBorrowConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
