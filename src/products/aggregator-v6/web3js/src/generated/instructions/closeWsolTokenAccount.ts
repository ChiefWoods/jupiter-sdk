import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';

export interface CloseWsolTokenAccountInstructionAccounts {
    tokenAccount: Address;
    user: Address;
    tokenProgram: Address;
    systemProgram: Address;
}

export function createCloseWsolTokenAccountInstruction(
    accounts: CloseWsolTokenAccountInstructionAccounts,
    programId: Address = JUPITER_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('cb816785c57d6b56', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
