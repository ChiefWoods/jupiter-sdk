import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface ReallocPoolInstructionAccounts {
    keeper: Address;
    pool: Address;
    systemProgram: Address;
    rent: Address;
}

export function createReallocPoolInstruction(
    accounts: ReallocPoolInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('728025a747e328b2', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
