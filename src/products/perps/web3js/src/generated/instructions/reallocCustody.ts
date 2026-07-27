import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface ReallocCustodyInstructionAccounts {
    keeper: Address;
    custody: Address;
    systemProgram: Address;
    rent: Address;
}

export function createReallocCustodyInstruction(
    accounts: ReallocCustodyInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('7b3a6d8b8507e1c8', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
