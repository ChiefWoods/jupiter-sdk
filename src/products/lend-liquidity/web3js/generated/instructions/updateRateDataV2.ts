import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    getRateDataV2ParamsDecoder,
    getRateDataV2ParamsEncoder,
    type RateDataV2ParamsArgs,
} from '../types/rateDataV2Params';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const UPDATE_RATE_DATA_V2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([116, 73, 53, 146, 216, 45, 228, 124]);

export interface UpdateRateDataV2InstructionAccounts {
    authority: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
}

export interface UpdateRateDataV2InstructionArgs {
    rateData: RateDataV2ParamsArgs;
}

function getUpdateRateDataV2InstructionDataEncoder(): Encoder<UpdateRateDataV2InstructionArgs> {
    return getStructEncoder([['rateData', getRateDataV2ParamsEncoder()]]);
}

function getUpdateRateDataV2InstructionDataDecoder(): Decoder<UpdateRateDataV2InstructionArgs> {
    return getStructDecoder([['rateData', getRateDataV2ParamsDecoder()]]);
}

export interface ParsedUpdateRateDataV2Instruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        rateModel: AccountMeta;
        mint: AccountMeta;
        tokenReserve: AccountMeta;
    };
    data: UpdateRateDataV2InstructionArgs;
}

export function parseUpdateRateDataV2Instruction(
    instruction: TransactionInstruction,
): ParsedUpdateRateDataV2Instruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for UpdateRateDataV2 instruction');
    }
    if (!UPDATE_RATE_DATA_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateRateDataV2 instruction discriminator mismatch');
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
        data: getUpdateRateDataV2InstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateRateDataV2Instruction(
    accounts: UpdateRateDataV2InstructionAccounts,
    args: UpdateRateDataV2InstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateRateDataV2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_RATE_DATA_V2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
