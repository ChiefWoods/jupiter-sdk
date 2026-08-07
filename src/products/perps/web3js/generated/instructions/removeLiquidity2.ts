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

export const REMOVE_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([230, 215, 82, 127, 241, 101, 227, 146]);

export interface RemoveLiquidity2InstructionAccounts {
    owner: Address;
    receivingAccount: Address;
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

export interface RemoveLiquidity2InstructionArgs {
    lpAmountIn: number | bigint;
    minAmountOut: number | bigint;
}

function getRemoveLiquidity2InstructionDataEncoder(): Encoder<RemoveLiquidity2InstructionArgs> {
    return getStructEncoder([
        ['lpAmountIn', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

function getRemoveLiquidity2InstructionDataDecoder(): Decoder<RemoveLiquidity2InstructionArgs> {
    return getStructDecoder([
        ['lpAmountIn', getU64Decoder()],
        ['minAmountOut', getU64Decoder()],
    ]);
}

export interface ParsedRemoveLiquidity2Instruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        receivingAccount: AccountMeta;
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
    data: RemoveLiquidity2InstructionArgs;
}

export function parseRemoveLiquidity2Instruction(
    instruction: TransactionInstruction,
): ParsedRemoveLiquidity2Instruction {
    if (instruction.keys.length < 14) {
        throw new Error('Expected 14 account metas for RemoveLiquidity2 instruction');
    }
    if (!REMOVE_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RemoveLiquidity2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            receivingAccount: instruction.keys[1]!,
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
        data: getRemoveLiquidity2InstructionDataDecoder().decode(instructionData),
    };
}

export function createRemoveLiquidity2Instruction(
    accounts: RemoveLiquidity2InstructionAccounts,
    args: RemoveLiquidity2InstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
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
    let data = Buffer.from(getRemoveLiquidity2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REMOVE_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
