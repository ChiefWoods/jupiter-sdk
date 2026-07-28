import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

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

export function createDepositCollateralForBorrowsInstruction(
    accounts: DepositCollateralForBorrowsInstructionAccounts,
    args: DepositCollateralForBorrowsInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
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
    const instructionData = Buffer.from(getDepositCollateralForBorrowsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('1102c3be4c10ee4a', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
