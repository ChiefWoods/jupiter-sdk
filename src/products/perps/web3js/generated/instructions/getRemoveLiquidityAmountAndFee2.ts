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

export const GET_REMOVE_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    183, 59, 72, 110, 223, 243, 150, 142,
]);

export interface GetRemoveLiquidityAmountAndFee2InstructionAccounts {
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    lpTokenMint: Address;
}

export interface GetRemoveLiquidityAmountAndFee2InstructionArgs {
    lpAmountIn: number | bigint;
}

function getGetRemoveLiquidityAmountAndFee2InstructionDataEncoder(): Encoder<GetRemoveLiquidityAmountAndFee2InstructionArgs> {
    return getStructEncoder([['lpAmountIn', getU64Encoder()]]);
}

function getGetRemoveLiquidityAmountAndFee2InstructionDataDecoder(): Decoder<GetRemoveLiquidityAmountAndFee2InstructionArgs> {
    return getStructDecoder([['lpAmountIn', getU64Decoder()]]);
}

export interface ParsedGetRemoveLiquidityAmountAndFee2Instruction {
    programId: Address;
    accounts: {
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        lpTokenMint: AccountMeta;
    };
    data: GetRemoveLiquidityAmountAndFee2InstructionArgs;
}

export function parseGetRemoveLiquidityAmountAndFee2Instruction(
    instruction: TransactionInstruction,
): ParsedGetRemoveLiquidityAmountAndFee2Instruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for GetRemoveLiquidityAmountAndFee2 instruction');
    }
    if (
        !GET_REMOVE_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('GetRemoveLiquidityAmountAndFee2 instruction discriminator mismatch');
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
        data: getGetRemoveLiquidityAmountAndFee2InstructionDataDecoder().decode(instructionData),
    };
}

export function createGetRemoveLiquidityAmountAndFee2Instruction(
    accounts: GetRemoveLiquidityAmountAndFee2InstructionAccounts,
    args: GetRemoveLiquidityAmountAndFee2InstructionArgs,
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
    let data = Buffer.from(getGetRemoveLiquidityAmountAndFee2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_REMOVE_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
