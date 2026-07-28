import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';

export interface UnpauseDexInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export function createUnpauseDexInstruction(
    accounts: UnpauseDexInstructionAccounts,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('5834af69d274b2da', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
