import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const CLAIM_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([122, 229, 144, 167, 42, 113, 16, 220]);

export interface ClaimTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    vaultTokenAccount: Address;
    ownerTokenAccount: Address;
    tokenProgram: Address;
}

export interface ParsedClaimTicketInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        owner: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
        vaultTokenAccount: AccountMeta;
        ownerTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseClaimTicketInstruction(instruction: TransactionInstruction): ParsedClaimTicketInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for ClaimTicket instruction');
    }
    if (!CLAIM_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimTicket instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            vault: instruction.keys[2]!,
            ticket: instruction.keys[3]!,
            vaultTokenAccount: instruction.keys[4]!,
            ownerTokenAccount: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export function createClaimTicketInstruction(
    accounts: ClaimTicketInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
