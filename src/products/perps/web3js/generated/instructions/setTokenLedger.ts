import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface SetTokenLedgerInstructionAccounts {
    tokenLedger: Address;
    tokenAccount: Address;
    tokenProgram: Address;
}

export function createSetTokenLedgerInstruction(
    accounts: SetTokenLedgerInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenLedger, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('e455b9704e4f4d02', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
