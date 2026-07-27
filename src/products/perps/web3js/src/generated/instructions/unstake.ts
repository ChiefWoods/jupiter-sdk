import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface UnstakeInstructionAccounts {
    operator: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    transferAuthority: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    clock: Address;
    stakeProgram: Address;
}

export function createUnstakeInstruction(
    accounts: UnstakeInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.clock, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('5a5f6b2acd7c32e1', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
