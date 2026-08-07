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

export const DEPOSIT_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    17, 2, 195, 190, 76, 16, 238, 74,
]);

export interface DepositCollateralForBorrowsInstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    transferAuthority: Address;
    borrowPosition: Address;
    collateralTokenAccount: Address;
    userTokenAccount: Address;
    lpTokenMint: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface DepositCollateralForBorrowsInstructionArgs {
    amount: number | bigint;
}

function getDepositCollateralForBorrowsInstructionDataEncoder(): Encoder<DepositCollateralForBorrowsInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getDepositCollateralForBorrowsInstructionDataDecoder(): Decoder<DepositCollateralForBorrowsInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedDepositCollateralForBorrowsInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        transferAuthority: AccountMeta;
        borrowPosition: AccountMeta;
        collateralTokenAccount: AccountMeta;
        userTokenAccount: AccountMeta;
        lpTokenMint: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: DepositCollateralForBorrowsInstructionArgs;
}

export function parseDepositCollateralForBorrowsInstruction(
    instruction: TransactionInstruction,
): ParsedDepositCollateralForBorrowsInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for DepositCollateralForBorrows instruction');
    }
    if (
        !DEPOSIT_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('DepositCollateralForBorrows instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            transferAuthority: instruction.keys[4]!,
            borrowPosition: instruction.keys[5]!,
            collateralTokenAccount: instruction.keys[6]!,
            userTokenAccount: instruction.keys[7]!,
            lpTokenMint: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: getDepositCollateralForBorrowsInstructionDataDecoder().decode(instructionData),
    };
}

export function createDepositCollateralForBorrowsInstruction(
    accounts: DepositCollateralForBorrowsInstructionAccounts,
    args: DepositCollateralForBorrowsInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getDepositCollateralForBorrowsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(DEPOSIT_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
