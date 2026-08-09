import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export const ESCROW_PROGRAMMABLE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    28, 157, 21, 234, 59, 222, 170, 178,
]);

export interface EscrowProgrammableNftWithdrawInstructionAccounts {
    signer: Address;
    signerUser: Address;
    nftMint: Address;
    nftMetadata: Address;
    nftEdition: Address;
    signerNftTokenAccount: Address;
    signerTokenRecord: Address;
    userEscrowTokenAccount: Address;
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

export interface ParsedEscrowProgrammableNftWithdrawInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        nftMint: AccountMeta;
        nftMetadata: AccountMeta;
        nftEdition: AccountMeta;
        signerNftTokenAccount: AccountMeta;
        signerTokenRecord: AccountMeta;
        userEscrowTokenAccount: AccountMeta;
        escrowTokenRecord: AccountMeta;
        authorizationRules: AccountMeta;
        metadataProgram: AccountMeta;
        instructions: AccountMeta;
        authorizationProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseEscrowProgrammableNftWithdrawInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowProgrammableNftWithdrawInstruction {
    if (instruction.keys.length < 18) {
        throw new Error('Expected 18 account metas for EscrowProgrammableNftWithdraw instruction');
    }
    if (
        !ESCROW_PROGRAMMABLE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('EscrowProgrammableNftWithdraw instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            nftMint: instruction.keys[2]!,
            nftMetadata: instruction.keys[3]!,
            nftEdition: instruction.keys[4]!,
            signerNftTokenAccount: instruction.keys[5]!,
            signerTokenRecord: instruction.keys[6]!,
            userEscrowTokenAccount: instruction.keys[7]!,
            escrowTokenRecord: instruction.keys[8]!,
            authorizationRules: instruction.keys[9]!,
            metadataProgram: instruction.keys[10]!,
            instructions: instruction.keys[11]!,
            authorizationProgram: instruction.keys[12]!,
            associatedTokenProgram: instruction.keys[13]!,
            tokenProgram: instruction.keys[14]!,
            systemProgram: instruction.keys[15]!,
            eventAuthority: instruction.keys[16]!,
            program: instruction.keys[17]!,
        },
        data: {},
    };
}

export async function createEscrowProgrammableNftWithdrawInstruction(
    accounts: EscrowProgrammableNftWithdrawInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
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
        { pubkey: accounts.userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowTokenRecord, isSigner: false, isWritable: true },
        accounts.authorizationRules
            ? { pubkey: accounts.authorizationRules, isSigner: false, isWritable: false }
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
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ESCROW_PROGRAMMABLE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
