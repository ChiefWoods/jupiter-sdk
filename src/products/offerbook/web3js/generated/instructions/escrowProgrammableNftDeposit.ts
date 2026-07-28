import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findUserEscrowTokenAccountPda } from '../pdas/userEscrowTokenAccount';

export interface EscrowProgrammableNftDepositInstructionAccounts {
    signer: Address;
    signerUser: Address;
    nftMint: Address;
    nftMetadata: Address;
    nftEdition: Address;
    signerNftTokenAccount: Address;
    signerTokenRecord: Address;
    userEscrowTokenAccount?: Address;
    escrowTokenRecord: Address;
    authorizationRules?: Address;
    metadataProgram: Address;
    instructions: Address;
    authorizationProgram?: Address;
    associatedTokenProgram: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export async function createEscrowProgrammableNftDepositInstruction(
    accounts: EscrowProgrammableNftDepositInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let userEscrowTokenAccount = accounts.userEscrowTokenAccount;
    if (!userEscrowTokenAccount) {
        const [derived] = await findUserEscrowTokenAccountPda(
            {
                signerUser: accounts.signerUser,
                tokenProgram: accounts.tokenProgram,
                mint: accounts.nftMint,
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
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
        { pubkey: accounts.nftMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.nftEdition, isSigner: false, isWritable: false },
        { pubkey: accounts.signerNftTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.signerTokenRecord, isSigner: false, isWritable: true },
        { pubkey: userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowTokenRecord, isSigner: false, isWritable: true },
        accounts.authorizationRules
            ? { pubkey: accounts.authorizationRules, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.instructions, isSigner: false, isWritable: false },
        accounts.authorizationProgram
            ? { pubkey: accounts.authorizationProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('df1d30471a0ef665', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
