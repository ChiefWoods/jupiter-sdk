import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const REFUND_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([178, 97, 75, 218, 227, 28, 21, 73]);

export interface RefundTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    vaultTokenAccount: Address;
    ticketAta: Address;
    ownerTokenAccount: Address;
    tokenProgram: Address;
}

export interface RefundTicketInstructionArgs {
    refundUsd: number | bigint;
}

function getRefundTicketInstructionDataEncoder(): Encoder<RefundTicketInstructionArgs> {
    return getStructEncoder([['refundUsd', getU64Encoder()]]);
}

function getRefundTicketInstructionDataDecoder(): Decoder<RefundTicketInstructionArgs> {
    return getStructDecoder([['refundUsd', getU64Decoder()]]);
}

export interface ParsedRefundTicketInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        owner: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
        vaultTokenAccount: AccountMeta;
        ticketAta: AccountMeta;
        ownerTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: RefundTicketInstructionArgs;
}

export function parseRefundTicketInstruction(instruction: TransactionInstruction): ParsedRefundTicketInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for RefundTicket instruction');
    }
    if (!REFUND_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RefundTicket instruction discriminator mismatch');
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
            ticketAta: instruction.keys[5]!,
            ownerTokenAccount: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
        },
        data: getRefundTicketInstructionDataDecoder().decode(instructionData),
    };
}

export function createRefundTicketInstruction(
    accounts: RefundTicketInstructionAccounts,
    args: RefundTicketInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRefundTicketInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REFUND_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
