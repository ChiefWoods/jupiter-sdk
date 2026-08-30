import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';

export const CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([116, 206, 27, 191, 166, 19, 0, 73]);

export interface ClaimTokenInstructionAccounts {
    inviteInfo: Address;
    inviteSigner: Address;
    claimer: Address;
    systemProgram: Address;
    keeper: Address;
    claimerTokenAccount: Address;
    escrowTokenAccount: Address;
    tokenProgram: Address;
    mint: Address;
    associatedTokenProgram: Address;
}

export interface ParsedClaimTokenInstruction {
    programId: Address;
    accounts: {
        inviteInfo: AccountMeta;
        inviteSigner: AccountMeta;
        claimer: AccountMeta;
        systemProgram: AccountMeta;
        keeper: AccountMeta;
        claimerTokenAccount: AccountMeta;
        escrowTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        mint: AccountMeta;
        associatedTokenProgram: AccountMeta;
    };
    data: {};
}

export function parseClaimTokenInstruction(instruction: TransactionInstruction): ParsedClaimTokenInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for ClaimToken instruction');
    }
    if (!CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            inviteInfo: instruction.keys[0]!,
            inviteSigner: instruction.keys[1]!,
            claimer: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
            keeper: instruction.keys[4]!,
            claimerTokenAccount: instruction.keys[5]!,
            escrowTokenAccount: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
            mint: instruction.keys[8]!,
            associatedTokenProgram: instruction.keys[9]!,
        },
        data: {},
    };
}

export function createClaimTokenInstruction(
    accounts: ClaimTokenInstructionAccounts,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.inviteSigner, isSigner: true, isWritable: true },
        { pubkey: accounts.claimer, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.claimerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: true },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
