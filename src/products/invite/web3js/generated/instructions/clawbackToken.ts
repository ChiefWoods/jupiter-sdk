import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';

export const CLAWBACK_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([246, 74, 130, 226, 137, 89, 136, 154]);

export interface ClawbackTokenInstructionAccounts {
    inviteInfo: Address;
    sender: Address;
    senderTokenAccount: Address;
    escrowTokenAccount: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    mint: Address;
}

export interface ParsedClawbackTokenInstruction {
    programId: Address;
    accounts: {
        inviteInfo: AccountMeta;
        sender: AccountMeta;
        senderTokenAccount: AccountMeta;
        escrowTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        mint: AccountMeta;
    };
    data: {};
}

export function parseClawbackTokenInstruction(instruction: TransactionInstruction): ParsedClawbackTokenInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for ClawbackToken instruction');
    }
    if (!CLAWBACK_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClawbackToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            inviteInfo: instruction.keys[0]!,
            sender: instruction.keys[1]!,
            senderTokenAccount: instruction.keys[2]!,
            escrowTokenAccount: instruction.keys[3]!,
            tokenProgram: instruction.keys[4]!,
            associatedTokenProgram: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
            mint: instruction.keys[7]!,
        },
        data: {},
    };
}

export function createClawbackTokenInstruction(
    accounts: ClawbackTokenInstructionAccounts,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.senderTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAWBACK_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
