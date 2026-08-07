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

export const WITHDRAW_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    117, 160, 60, 82, 237, 233, 46, 182,
]);

export interface WithdrawCollateralForBorrowsInstructionAccounts {
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
    eventAuthority: Address;
    program: Address;
}

export interface WithdrawCollateralForBorrowsInstructionArgs {
    amount: number | bigint;
}

function getWithdrawCollateralForBorrowsInstructionDataEncoder(): Encoder<WithdrawCollateralForBorrowsInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getWithdrawCollateralForBorrowsInstructionDataDecoder(): Decoder<WithdrawCollateralForBorrowsInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedWithdrawCollateralForBorrowsInstruction {
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
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: WithdrawCollateralForBorrowsInstructionArgs;
}

export function parseWithdrawCollateralForBorrowsInstruction(
    instruction: TransactionInstruction,
): ParsedWithdrawCollateralForBorrowsInstruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for WithdrawCollateralForBorrows instruction');
    }
    if (
        !WITHDRAW_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('WithdrawCollateralForBorrows instruction discriminator mismatch');
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
            eventAuthority: instruction.keys[10]!,
            program: instruction.keys[11]!,
        },
        data: getWithdrawCollateralForBorrowsInstructionDataDecoder().decode(instructionData),
    };
}

export function createWithdrawCollateralForBorrowsInstruction(
    accounts: WithdrawCollateralForBorrowsInstructionAccounts,
    args: WithdrawCollateralForBorrowsInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getWithdrawCollateralForBorrowsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(WITHDRAW_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
