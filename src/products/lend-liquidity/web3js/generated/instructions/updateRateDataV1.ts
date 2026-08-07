import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    getRateDataV1ParamsDecoder,
    getRateDataV1ParamsEncoder,
    type RateDataV1ParamsArgs,
} from '../types/rateDataV1Params';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const UPDATE_RATE_DATA_V1_INSTRUCTION_DISCRIMINATOR = new Uint8Array([6, 20, 34, 122, 22, 150, 180, 22]);

export interface UpdateRateDataV1InstructionAccounts {
    authority: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
}

export interface UpdateRateDataV1InstructionArgs {
    rateData: RateDataV1ParamsArgs;
}

function getUpdateRateDataV1InstructionDataEncoder(): Encoder<UpdateRateDataV1InstructionArgs> {
    return getStructEncoder([['rateData', getRateDataV1ParamsEncoder()]]);
}

function getUpdateRateDataV1InstructionDataDecoder(): Decoder<UpdateRateDataV1InstructionArgs> {
    return getStructDecoder([['rateData', getRateDataV1ParamsDecoder()]]);
}

export interface ParsedUpdateRateDataV1Instruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        rateModel: AccountMeta;
        mint: AccountMeta;
        tokenReserve: AccountMeta;
    };
    data: UpdateRateDataV1InstructionArgs;
}

export function parseUpdateRateDataV1Instruction(
    instruction: TransactionInstruction,
): ParsedUpdateRateDataV1Instruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for UpdateRateDataV1 instruction');
    }
    if (!UPDATE_RATE_DATA_V1_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateRateDataV1 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
            rateModel: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            tokenReserve: instruction.keys[4]!,
        },
        data: getUpdateRateDataV1InstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateRateDataV1Instruction(
    accounts: UpdateRateDataV1InstructionAccounts,
    args: UpdateRateDataV1InstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateRateDataV1InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_RATE_DATA_V1_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
