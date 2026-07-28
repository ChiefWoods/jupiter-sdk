import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';

export interface QueueProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    transaction: Address;
    smartWallet: Address;
    payer: Address;
    smartWalletProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createQueueProposalInstruction(
    accounts: QueueProposalInstructionAccounts,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.transaction, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.smartWalletProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('a8db8bd3cd987d6e', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
