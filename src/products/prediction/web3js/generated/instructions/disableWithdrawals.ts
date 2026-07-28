import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface DisableWithdrawalsInstructionAccounts {
    authority: Address;
    vault: Address;
}

export function createDisableWithdrawalsInstruction(
    accounts: DisableWithdrawalsInstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('9688ce78ade689d1', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
