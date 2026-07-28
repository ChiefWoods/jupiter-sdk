import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';

export interface ClawbackInstructionAccounts {
    campaign: Address;
    from: Address;
    to: Address;
    admin: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export function createClawbackInstruction(
    accounts: ClawbackInstructionAccounts,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: false },
        { pubkey: accounts.from, isSigner: false, isWritable: true },
        { pubkey: accounts.to, isSigner: false, isWritable: true },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('6f5c8e4f21ea521b', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
