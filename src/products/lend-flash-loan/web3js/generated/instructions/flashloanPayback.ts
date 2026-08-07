import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const FLASHLOAN_PAYBACK_INSTRUCTION_DISCRIMINATOR = new Uint8Array([213, 47, 153, 137, 84, 243, 94, 232]);

export interface FlashloanPaybackInstructionAccounts {
    signer: Address;
    flashloanAdmin: Address;
    signerBorrowTokenAccount: Address;
    mint: Address;
    flashloanTokenReservesLiquidity: Address;
    flashloanBorrowPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    liquidity: Address;
    liquidityProgram: Address;
    tokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
    instructionSysvar: Address;
}

export interface FlashloanPaybackInstructionArgs {
    amount: number | bigint;
}

function getFlashloanPaybackInstructionDataEncoder(): Encoder<FlashloanPaybackInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getFlashloanPaybackInstructionDataDecoder(): Decoder<FlashloanPaybackInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedFlashloanPaybackInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        flashloanAdmin: AccountMeta;
        signerBorrowTokenAccount: AccountMeta;
        mint: AccountMeta;
        flashloanTokenReservesLiquidity: AccountMeta;
        flashloanBorrowPositionOnLiquidity: AccountMeta;
        rateModel: AccountMeta;
        vault: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        instructionSysvar: AccountMeta;
    };
    data: FlashloanPaybackInstructionArgs;
}

export function parseFlashloanPaybackInstruction(
    instruction: TransactionInstruction,
): ParsedFlashloanPaybackInstruction {
    if (instruction.keys.length < 14) {
        throw new Error('Expected 14 account metas for FlashloanPayback instruction');
    }
    if (!FLASHLOAN_PAYBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('FlashloanPayback instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            flashloanAdmin: instruction.keys[1]!,
            signerBorrowTokenAccount: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            flashloanTokenReservesLiquidity: instruction.keys[4]!,
            flashloanBorrowPositionOnLiquidity: instruction.keys[5]!,
            rateModel: instruction.keys[6]!,
            vault: instruction.keys[7]!,
            liquidity: instruction.keys[8]!,
            liquidityProgram: instruction.keys[9]!,
            tokenProgram: instruction.keys[10]!,
            associatedTokenProgram: instruction.keys[11]!,
            systemProgram: instruction.keys[12]!,
            instructionSysvar: instruction.keys[13]!,
        },
        data: getFlashloanPaybackInstructionDataDecoder().decode(instructionData),
    };
}

export function createFlashloanPaybackInstruction(
    accounts: FlashloanPaybackInstructionAccounts,
    args: FlashloanPaybackInstructionArgs,
    programId: Address = LENDFLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.signerBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.flashloanTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.flashloanBorrowPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.instructionSysvar, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getFlashloanPaybackInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(FLASHLOAN_PAYBACK_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
