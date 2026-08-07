import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const ACCEPT_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([221, 14, 228, 109, 203, 47, 92, 51]);

export interface AcceptTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    vaultTokenAccount: Address;
    ticketAta: Address;
    tokenProgram: Address;
}

export interface AcceptTicketInstructionArgs {
    venueTicketId: string;
    maxPayoutUsd: number | bigint;
}

function getAcceptTicketInstructionDataEncoder(): Encoder<AcceptTicketInstructionArgs> {
    return getStructEncoder([
        ['venueTicketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['maxPayoutUsd', getU64Encoder()],
    ]);
}

function getAcceptTicketInstructionDataDecoder(): Decoder<AcceptTicketInstructionArgs> {
    return getStructDecoder([
        ['venueTicketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['maxPayoutUsd', getU64Decoder()],
    ]);
}

export interface ParsedAcceptTicketInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        owner: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
        vaultTokenAccount: AccountMeta;
        ticketAta: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: AcceptTicketInstructionArgs;
}

export function parseAcceptTicketInstruction(instruction: TransactionInstruction): ParsedAcceptTicketInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for AcceptTicket instruction');
    }
    if (!ACCEPT_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('AcceptTicket instruction discriminator mismatch');
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
            tokenProgram: instruction.keys[6]!,
        },
        data: getAcceptTicketInstructionDataDecoder().decode(instructionData),
    };
}

export function createAcceptTicketInstruction(
    accounts: AcceptTicketInstructionAccounts,
    args: AcceptTicketInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getAcceptTicketInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ACCEPT_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
