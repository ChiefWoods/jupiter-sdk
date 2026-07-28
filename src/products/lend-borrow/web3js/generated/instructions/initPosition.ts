import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { findMetadataAccountPda } from '../pdas/metadataAccount';
import { findPositionMintPda } from '../pdas/positionMint';
import { findPositionPda } from '../pdas/position';
import { findPositionTokenAccountPda } from '../pdas/positionTokenAccount';
import { getStructEncoder, getU16Encoder, getU32Encoder, type Encoder } from '@solana/codecs';

export interface InitPositionInstructionAccounts {
    signer: Address;
    vaultAdmin: Address;
    vaultState: Address;
    position?: Address;
    positionMint?: Address;
    positionTokenAccount?: Address;
    metadataAccount?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    sysvarInstruction: Address;
    metadataProgram: Address;
    rent: Address;
}

export interface InitPositionInstructionArgs {
    vaultId: number;
    nextPositionId: number;
}

function getInitPositionInstructionDataEncoder(): Encoder<InitPositionInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['nextPositionId', getU32Encoder()],
    ]);
}

export async function createInitPositionInstruction(
    accounts: InitPositionInstructionAccounts,
    args: InitPositionInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let position = accounts.position;
    if (!position) {
        const [derived] = await findPositionPda(
            {
                vaultId: args.vaultId,
                nextPositionId: args.nextPositionId,
            },
            programId,
        );
        position = derived;
    }
    let positionMint = accounts.positionMint;
    if (!positionMint) {
        const [derived] = await findPositionMintPda(
            {
                vaultId: args.vaultId,
                nextPositionId: args.nextPositionId,
            },
            programId,
        );
        positionMint = derived;
    }
    let positionTokenAccount = accounts.positionTokenAccount;
    if (!positionTokenAccount) {
        const [derived] = await findPositionTokenAccountPda(
            {
                signer: accounts.signer,
                positionMint: accounts.positionMint,
            },
            programId,
        );
        positionTokenAccount = derived;
    }
    let metadataAccount = accounts.metadataAccount;
    if (!metadataAccount) {
        const [derived] = await findMetadataAccountPda(
            {
                positionMint: accounts.positionMint,
            },
            programId,
        );
        metadataAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: position, isSigner: false, isWritable: true },
        { pubkey: positionMint, isSigner: false, isWritable: true },
        { pubkey: positionTokenAccount, isSigner: false, isWritable: true },
        { pubkey: metadataAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.sysvarInstruction, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitPositionInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('c5140a0161a0b15b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
