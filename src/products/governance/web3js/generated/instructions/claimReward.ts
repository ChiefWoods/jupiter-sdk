import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';

export interface ClaimRewardInstructionAccounts {
    governor: Address;
    rewardVault: Address;
    proposal: Address;
    vote: Address;
    voter: Address;
    voterTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createClaimRewardInstruction(
    accounts: ClaimRewardInstructionAccounts,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.vote, isSigner: false, isWritable: true },
        { pubkey: accounts.voter, isSigner: true, isWritable: false },
        { pubkey: accounts.voterTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('955fb5f25e5a9ea2', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
