import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';

export interface UnpauseSwapAndArbitrageInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export function createUnpauseSwapAndArbitrageInstruction(
    accounts: UnpauseSwapAndArbitrageInstructionAccounts,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('f104c56ef4ffacb8', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
