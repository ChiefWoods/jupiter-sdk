import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const PARTIAL_LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    250, 166, 13, 74, 97, 204, 130, 209,
]);

export interface PartialLiquidateBorrowPositionInstructionAccounts {
    signer: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    transferAuthority: Address;
    borrowPosition: Address;
    collateralTokenAccount: Address;
    lpTokenMint: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedPartialLiquidateBorrowPositionInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        transferAuthority: AccountMeta;
        borrowPosition: AccountMeta;
        collateralTokenAccount: AccountMeta;
        lpTokenMint: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parsePartialLiquidateBorrowPositionInstruction(
    instruction: TransactionInstruction,
): ParsedPartialLiquidateBorrowPositionInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for PartialLiquidateBorrowPosition instruction');
    }
    if (
        !PARTIAL_LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('PartialLiquidateBorrowPosition instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            transferAuthority: instruction.keys[4]!,
            borrowPosition: instruction.keys[5]!,
            collateralTokenAccount: instruction.keys[6]!,
            lpTokenMint: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            eventAuthority: instruction.keys[9]!,
            program: instruction.keys[10]!,
        },
        data: {},
    };
}

export function createPartialLiquidateBorrowPositionInstruction(
    accounts: PartialLiquidateBorrowPositionInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PARTIAL_LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
