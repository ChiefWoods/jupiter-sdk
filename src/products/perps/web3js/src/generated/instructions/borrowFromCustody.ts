import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface BorrowFromCustodyInstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    transferAuthority: Address;
    borrowPosition: Address;
    custodyTokenAccount: Address;
    userTokenAccount: Address;
    lpTokenMint: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface BorrowFromCustodyInstructionArgs {
    amount: number | bigint;
}

function getBorrowFromCustodyInstructionDataEncoder(): Encoder<BorrowFromCustodyInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

export function createBorrowFromCustodyInstruction(
    accounts: BorrowFromCustodyInstructionAccounts,
    args: BorrowFromCustodyInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getBorrowFromCustodyInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('99b741417121f92d', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
