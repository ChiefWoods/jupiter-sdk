import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';
import { findClaimStatusPda } from '../pdas/claimStatus';

export interface InitializeClaimStatusInstructionAccounts {
    campaign: Address;
    claimStatus?: Address;
    claimant: Address;
    systemProgram: Address;
}

export async function createInitializeClaimStatusInstruction(
    accounts: InitializeClaimStatusInstructionAccounts,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let claimStatus = accounts.claimStatus;
    if (!claimStatus) {
        const [derived] = await findClaimStatusPda(
            {
                claimant: accounts.claimant,
                campaign: accounts.campaign,
            },
            programId,
        );
        claimStatus = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: claimStatus, isSigner: false, isWritable: true },
        { pubkey: accounts.claimant, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('8506fad485914588', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
