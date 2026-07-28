import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';

export interface PauseDexInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export function createPauseDexInstruction(
    accounts: PauseDexInstructionAccounts,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('8aff650074ca8064', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
