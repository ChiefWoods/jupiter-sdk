import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface DisableDepositsInstructionAccounts {
    authority: Address;
    vault: Address;
}

export function createDisableDepositsInstruction(
    accounts: DisableDepositsInstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('d60d67f84257a4c8', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
