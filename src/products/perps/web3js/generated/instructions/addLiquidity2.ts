import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export const ADD_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([228, 162, 78, 28, 70, 219, 116, 115]);

export interface AddLiquidity2InstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    lpTokenAccount: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    custodyTokenAccount: Address;
    lpTokenMint: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface AddLiquidity2InstructionArgs {
    tokenAmountIn: number | bigint;
    minLpAmountOut: number | bigint;
    tokenAmountPreSwap: OptionOrNullable<number | bigint>;
}

function getAddLiquidity2InstructionDataEncoder(): Encoder<AddLiquidity2InstructionArgs> {
    return getStructEncoder([
        ['tokenAmountIn', getU64Encoder()],
        ['minLpAmountOut', getU64Encoder()],
        ['tokenAmountPreSwap', getOptionEncoder(getU64Encoder())],
    ]);
}

function getAddLiquidity2InstructionDataDecoder(): Decoder<AddLiquidity2InstructionArgs> {
    return getStructDecoder([
        ['tokenAmountIn', getU64Decoder()],
        ['minLpAmountOut', getU64Decoder()],
        ['tokenAmountPreSwap', getOptionDecoder(getU64Decoder())],
    ]);
}

export interface ParsedAddLiquidity2Instruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        fundingAccount: AccountMeta;
        lpTokenAccount: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        custodyTokenAccount: AccountMeta;
        lpTokenMint: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: AddLiquidity2InstructionArgs;
}

export function parseAddLiquidity2Instruction(instruction: TransactionInstruction): ParsedAddLiquidity2Instruction {
    if (instruction.keys.length < 14) {
        throw new Error('Expected 14 account metas for AddLiquidity2 instruction');
    }
    if (!ADD_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('AddLiquidity2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            fundingAccount: instruction.keys[1]!,
            lpTokenAccount: instruction.keys[2]!,
            transferAuthority: instruction.keys[3]!,
            perpetuals: instruction.keys[4]!,
            pool: instruction.keys[5]!,
            custody: instruction.keys[6]!,
            custodyDovesPriceAccount: instruction.keys[7]!,
            custodyPythnetPriceAccount: instruction.keys[8]!,
            custodyTokenAccount: instruction.keys[9]!,
            lpTokenMint: instruction.keys[10]!,
            tokenProgram: instruction.keys[11]!,
            eventAuthority: instruction.keys[12]!,
            program: instruction.keys[13]!,
        },
        data: getAddLiquidity2InstructionDataDecoder().decode(instructionData),
    };
}

export function createAddLiquidity2Instruction(
    accounts: AddLiquidity2InstructionAccounts,
    args: AddLiquidity2InstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getAddLiquidity2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ADD_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
