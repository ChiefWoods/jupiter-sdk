import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const CLOSE_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([66, 209, 114, 197, 75, 27, 182, 117]);

export interface CloseTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    rentDestination: Address;
    ticketAta: Address;
    ownerTokenAccount: Address;
    tokenProgram: Address;
}

export interface ParsedCloseTicketInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        owner: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
        rentDestination: AccountMeta;
        ticketAta: AccountMeta;
        ownerTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseCloseTicketInstruction(instruction: TransactionInstruction): ParsedCloseTicketInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for CloseTicket instruction');
    }
    if (!CLOSE_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseTicket instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            vault: instruction.keys[2]!,
            ticket: instruction.keys[3]!,
            rentDestination: instruction.keys[4]!,
            ticketAta: instruction.keys[5]!,
            ownerTokenAccount: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
        },
        data: {},
    };
}

export function createCloseTicketInstruction(
    accounts: CloseTicketInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.rentDestination, isSigner: false, isWritable: true },
        { pubkey: accounts.ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
