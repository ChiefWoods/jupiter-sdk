import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findUserEscrowTokenAccountPda } from '../pdas/userEscrowTokenAccount';

export const ESCROW_CLASSIC_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    58, 102, 79, 16, 208, 182, 217, 35,
]);

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

export interface ParsedEscrowClassicNftWithdrawInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerNftTokenAccount: AccountMeta;
        signerUser: AccountMeta;
        nftMint: AccountMeta;
        userEscrowTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseEscrowClassicNftWithdrawInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowClassicNftWithdrawInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for EscrowClassicNftWithdraw instruction');
    }
    if (
        !ESCROW_CLASSIC_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('EscrowClassicNftWithdraw instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerNftTokenAccount: instruction.keys[1]!,
            signerUser: instruction.keys[2]!,
            nftMint: instruction.keys[3]!,
            userEscrowTokenAccount: instruction.keys[4]!,
            tokenProgram: instruction.keys[5]!,
            eventAuthority: instruction.keys[6]!,
            program: instruction.keys[7]!,
        },
        data: {},
    };
}

export async function createEscrowClassicNftWithdrawInstruction(
    accounts: EscrowClassicNftWithdrawInstructionAccounts,
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
        { pubkey: accounts.signerNftTokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
        { pubkey: userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ESCROW_CLASSIC_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
