import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';

export interface CloseClaimStatusInstructionAccounts {
    campaign: Address;
    claimStatus: Address;
    closer: Address;
    claimant: Address;
}

export function createCloseClaimStatusInstruction(
    accounts: CloseClaimStatusInstructionAccounts,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: false },
        { pubkey: accounts.claimStatus, isSigner: false, isWritable: true },
        { pubkey: accounts.closer, isSigner: true, isWritable: false },
        { pubkey: accounts.claimant, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('a3d6bfa5f5bc11b9', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
