import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    162, 9, 186, 9, 213, 30, 173, 78,
]);

export interface UpdateUserWithdrawalLimitInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
}

export interface UpdateUserWithdrawalLimitInstructionArgs {
    newLimit: number | bigint;
    protocol: Address;
    mint: Address;
}

function getUpdateUserWithdrawalLimitInstructionDataEncoder(): Encoder<UpdateUserWithdrawalLimitInstructionArgs> {
    return getStructEncoder([
        ['newLimit', getU128Encoder()],
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateUserWithdrawalLimitInstructionDataDecoder(): Decoder<UpdateUserWithdrawalLimitInstructionArgs> {
    return getStructDecoder([
        ['newLimit', getU128Decoder()],
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateUserWithdrawalLimitInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        userSupplyPosition: AccountMeta;
    };
    data: UpdateUserWithdrawalLimitInstructionArgs;
}

export function parseUpdateUserWithdrawalLimitInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUserWithdrawalLimitInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateUserWithdrawalLimit instruction');
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
            authList: instruction.keys[1]!,
            userSupplyPosition: instruction.keys[2]!,
        },
        data: getUpdateUserWithdrawalLimitInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserWithdrawalLimitInstruction(
    accounts: UpdateUserWithdrawalLimitInstructionAccounts,
    args: UpdateUserWithdrawalLimitInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
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
