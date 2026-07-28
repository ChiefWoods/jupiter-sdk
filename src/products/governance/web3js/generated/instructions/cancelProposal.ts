import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';

export interface CancelProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    proposer: Address;
    eventAuthority: Address;
    program: Address;
}

export function createCancelProposalInstruction(
    accounts: CancelProposalInstructionAccounts,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.proposer, isSigner: true, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('6a4a809213412717', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
