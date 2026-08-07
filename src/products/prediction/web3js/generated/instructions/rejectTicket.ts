import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const REJECT_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([74, 58, 176, 24, 204, 162, 30, 75]);

export interface RejectTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    ticketAta: Address;
    ownerTokenAccount: Address;
    tokenProgram: Address;
}

export interface ParsedRejectTicketInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        owner: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
        ticketAta: AccountMeta;
        ownerTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseRejectTicketInstruction(instruction: TransactionInstruction): ParsedRejectTicketInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for RejectTicket instruction');
    }
    if (!REJECT_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RejectTicket instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            vault: instruction.keys[2]!,
            ticket: instruction.keys[3]!,
            ticketAta: instruction.keys[4]!,
            ownerTokenAccount: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export function createRejectTicketInstruction(
    accounts: RejectTicketInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REJECT_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
