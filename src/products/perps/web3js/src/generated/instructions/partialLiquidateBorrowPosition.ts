import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

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

export function createPartialLiquidateBorrowPositionInstruction(
    accounts: PartialLiquidateBorrowPositionInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
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
    const data = Buffer.from('faa60d4a61cc82d1', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
