import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findUserEscrowTokenAccountPda } from '../pdas/userEscrowTokenAccount';

export interface EscrowClassicNftWithdrawInstructionAccounts {
    signer: Address;
    signerNftTokenAccount: Address;
    signerUser: Address;
    nftMint: Address;
    userEscrowTokenAccount?: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export async function createEscrowClassicNftWithdrawInstruction(
    accounts: EscrowClassicNftWithdrawInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let userEscrowTokenAccount = accounts.userEscrowTokenAccount;
    if (!userEscrowTokenAccount) {
        const [derived] = await findUserEscrowTokenAccountPda(
            {
                signerUser: accounts.signerUser,
                tokenProgram: accounts.tokenProgram,
                nftMint: accounts.nftMint,
            },
            programId,
        );
        userEscrowTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerNftTokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
        { pubkey: userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('3a664f10d0b6d923', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
