import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { getPriceCalcModeDecoder, getPriceCalcModeEncoder, type PriceCalcModeArgs } from '../types/priceCalcMode';

export const GET_ASSETS_UNDER_MANAGEMENT2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    193, 210, 13, 249, 113, 149, 29, 84,
]);

export interface GetAssetsUnderManagement2InstructionAccounts {
    perpetuals: Address;
    pool: Address;
}

export interface GetAssetsUnderManagement2InstructionArgs {
    mode: OptionOrNullable<PriceCalcModeArgs>;
}

function getGetAssetsUnderManagement2InstructionDataEncoder(): Encoder<GetAssetsUnderManagement2InstructionArgs> {
    return getStructEncoder([['mode', getOptionEncoder(getPriceCalcModeEncoder())]]);
}

function getGetAssetsUnderManagement2InstructionDataDecoder(): Decoder<GetAssetsUnderManagement2InstructionArgs> {
    return getStructDecoder([['mode', getOptionDecoder(getPriceCalcModeDecoder())]]);
}

export interface ParsedGetAssetsUnderManagement2Instruction {
    programId: Address;
    accounts: {
        perpetuals: AccountMeta;
        pool: AccountMeta;
    };
    data: GetAssetsUnderManagement2InstructionArgs;
}

export function parseGetAssetsUnderManagement2Instruction(
    instruction: TransactionInstruction,
): ParsedGetAssetsUnderManagement2Instruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for GetAssetsUnderManagement2 instruction');
    }
    if (
        !GET_ASSETS_UNDER_MANAGEMENT2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('GetAssetsUnderManagement2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            perpetuals: instruction.keys[0]!,
            pool: instruction.keys[1]!,
        },
        data: getGetAssetsUnderManagement2InstructionDataDecoder().decode(instructionData),
    };
}

export function createGetAssetsUnderManagement2Instruction(
    accounts: GetAssetsUnderManagement2InstructionAccounts,
    args: GetAssetsUnderManagement2InstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getGetAssetsUnderManagement2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_ASSETS_UNDER_MANAGEMENT2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
