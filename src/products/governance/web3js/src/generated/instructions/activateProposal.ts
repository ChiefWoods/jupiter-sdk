import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';

export interface ActivateProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    locker: Address;
}

export function createActivateProposalInstruction(
    accounts: ActivateProposalInstructionAccounts,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.locker, isSigner: true, isWritable: false },
    ];
    const data = Buffer.from('5abacbea46b9bf15', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
