import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';

export const EXPIRE_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([90, 208, 189, 130, 72, 252, 204, 11]);

export interface ExpireTokenInstructionAccounts {
    inviteInfo: Address;
    sender: Address;
    senderTokenAccount: Address;
    escrowTokenAccount: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    mint: Address;
    keeper: Address;
}

export interface ParsedExpireTokenInstruction {
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
        keeper: AccountMeta;
    };
    data: {};
}

export function parseExpireTokenInstruction(instruction: TransactionInstruction): ParsedExpireTokenInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for ExpireToken instruction');
    }
    if (!EXPIRE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ExpireToken instruction discriminator mismatch');
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
            keeper: instruction.keys[8]!,
        },
        data: {},
    };
}

export function createExpireTokenInstruction(
    accounts: ExpireTokenInstructionAccounts,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: false, isWritable: true },
        { pubkey: accounts.senderTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: true },
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(EXPIRE_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
