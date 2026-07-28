import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';

export interface PauseSwapAndArbitrageInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export function createPauseSwapAndArbitrageInstruction(
    accounts: PauseSwapAndArbitrageInstructionAccounts,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('fc43a63e2d88584c', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
