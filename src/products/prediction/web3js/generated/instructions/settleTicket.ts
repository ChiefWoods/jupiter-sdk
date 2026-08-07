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

export const SETTLE_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([201, 80, 119, 145, 208, 184, 168, 70]);

export interface SettleTicketInstructionAccounts {
    authority: Address;
    vault: Address;
    ticket: Address;
}

export interface SettleTicketInstructionArgs {
    payoutUsd: number | bigint;
}

function getSettleTicketInstructionDataEncoder(): Encoder<SettleTicketInstructionArgs> {
    return getStructEncoder([['payoutUsd', getU64Encoder()]]);
}

function getSettleTicketInstructionDataDecoder(): Decoder<SettleTicketInstructionArgs> {
    return getStructDecoder([['payoutUsd', getU64Decoder()]]);
}

export interface ParsedSettleTicketInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
    };
    data: SettleTicketInstructionArgs;
}

export function parseSettleTicketInstruction(instruction: TransactionInstruction): ParsedSettleTicketInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SettleTicket instruction');
    }
    if (!SETTLE_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SettleTicket instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vault: instruction.keys[1]!,
            ticket: instruction.keys[2]!,
        },
        data: getSettleTicketInstructionDataDecoder().decode(instructionData),
    };
}

export function createSettleTicketInstruction(
    accounts: SettleTicketInstructionAccounts,
    args: SettleTicketInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSettleTicketInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SETTLE_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
