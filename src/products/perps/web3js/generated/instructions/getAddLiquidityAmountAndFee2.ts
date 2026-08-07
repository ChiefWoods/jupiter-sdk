import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const GET_ADD_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    109, 157, 55, 169, 8, 81, 4, 118,
]);

export interface GetAddLiquidityAmountAndFee2InstructionAccounts {
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    lpTokenMint: Address;
}

export interface GetAddLiquidityAmountAndFee2InstructionArgs {
    tokenAmountIn: number | bigint;
}

function getGetAddLiquidityAmountAndFee2InstructionDataEncoder(): Encoder<GetAddLiquidityAmountAndFee2InstructionArgs> {
    return getStructEncoder([['tokenAmountIn', getU64Encoder()]]);
}

function getGetAddLiquidityAmountAndFee2InstructionDataDecoder(): Decoder<GetAddLiquidityAmountAndFee2InstructionArgs> {
    return getStructDecoder([['tokenAmountIn', getU64Decoder()]]);
}

export interface ParsedGetAddLiquidityAmountAndFee2Instruction {
    programId: Address;
    accounts: {
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        lpTokenMint: AccountMeta;
    };
    data: GetAddLiquidityAmountAndFee2InstructionArgs;
}

export function parseGetAddLiquidityAmountAndFee2Instruction(
    instruction: TransactionInstruction,
): ParsedGetAddLiquidityAmountAndFee2Instruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for GetAddLiquidityAmountAndFee2 instruction');
    }
    if (
        !GET_ADD_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('GetAddLiquidityAmountAndFee2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            perpetuals: instruction.keys[0]!,
            pool: instruction.keys[1]!,
            custody: instruction.keys[2]!,
            custodyDovesPriceAccount: instruction.keys[3]!,
            custodyPythnetPriceAccount: instruction.keys[4]!,
            lpTokenMint: instruction.keys[5]!,
        },
        data: getGetAddLiquidityAmountAndFee2InstructionDataDecoder().decode(instructionData),
    };
}

export function createGetAddLiquidityAmountAndFee2Instruction(
    accounts: GetAddLiquidityAmountAndFee2InstructionAccounts,
    args: GetAddLiquidityAmountAndFee2InstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getGetAddLiquidityAmountAndFee2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_ADD_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
