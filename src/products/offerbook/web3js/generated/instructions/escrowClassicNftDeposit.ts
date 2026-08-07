import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findUserEscrowTokenAccountPda } from '../pdas/userEscrowTokenAccount';

export const ESCROW_CLASSIC_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    148, 223, 191, 56, 93, 16, 156, 207,
]);

export interface EscrowClassicNftDepositInstructionAccounts {
    signer: Address;
    signerNftTokenAccount: Address;
    signerUser: Address;
    nftMint: Address;
    nftMetadata: Address;
    nftEdition: Address;
    userEscrowTokenAccount?: Address;
    metadataProgram: Address;
    associatedTokenProgram: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedEscrowClassicNftDepositInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerNftTokenAccount: AccountMeta;
        signerUser: AccountMeta;
        nftMint: AccountMeta;
        nftMetadata: AccountMeta;
        nftEdition: AccountMeta;
        userEscrowTokenAccount: AccountMeta;
        metadataProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseEscrowClassicNftDepositInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowClassicNftDepositInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for EscrowClassicNftDeposit instruction');
    }
    if (
        !ESCROW_CLASSIC_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('EscrowClassicNftDeposit instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerNftTokenAccount: instruction.keys[1]!,
            signerUser: instruction.keys[2]!,
            nftMint: instruction.keys[3]!,
            nftMetadata: instruction.keys[4]!,
            nftEdition: instruction.keys[5]!,
            userEscrowTokenAccount: instruction.keys[6]!,
            metadataProgram: instruction.keys[7]!,
            associatedTokenProgram: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: {},
    };
}

export async function createEscrowClassicNftDepositInstruction(
    accounts: EscrowClassicNftDepositInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let userEscrowTokenAccount = accounts.userEscrowTokenAccount;
    if (!userEscrowTokenAccount) {
        const [derived] = await findUserEscrowTokenAccountPda({
            signerUser: accounts.signerUser,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.nftMint,
        });
        userEscrowTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerNftTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
        { pubkey: accounts.nftMetadata, isSigner: false, isWritable: false },
        { pubkey: accounts.nftEdition, isSigner: false, isWritable: false },
        { pubkey: userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ESCROW_CLASSIC_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
