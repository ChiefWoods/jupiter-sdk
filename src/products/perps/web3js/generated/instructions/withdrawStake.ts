import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface WithdrawStakeInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyTokenAccount: Address;
    transferAuthority: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    clock: Address;
    stakeHistory: Address;
    stakeProgram: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export function createWithdrawStakeInstruction(
    accounts: WithdrawStakeInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.clock, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeHistory, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('9908168a69b05742', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
