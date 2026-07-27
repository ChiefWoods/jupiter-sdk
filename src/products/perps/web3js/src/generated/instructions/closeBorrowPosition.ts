import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface CloseBorrowPositionInstructionAccounts {
    owner: Address;
    borrowPosition: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createCloseBorrowPositionInstruction(
    accounts: CloseBorrowPositionInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('cce291cde825038c', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
