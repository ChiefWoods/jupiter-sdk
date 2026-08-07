import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
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
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { findTicketAtaPda } from '../pdas/ticketAta';
import { findVaultPda } from '../pdas/vault';

export const CREATE_TICKET_INSTRUCTION_DISCRIMINATOR = new Uint8Array([16, 178, 122, 25, 213, 85, 96, 129]);

export interface CreateTicketInstructionAccounts {
    payer: Address;
    owner: Address;
    authority: Address;
    vault?: Address;
    ticket: Address;
    ownerTokenAccount: Address;
    settlementMint: Address;
    ticketAta?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface CreateTicketInstructionArgs {
    ticketId: string;
    ticketIdHash: ReadonlyUint8Array;
    marketId: string;
    stakeUsd: number | bigint;
}

function getCreateTicketInstructionDataEncoder(): Encoder<CreateTicketInstructionArgs> {
    return getStructEncoder([
        ['ticketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['ticketIdHash', fixEncoderSize(getBytesEncoder(), 32)],
        ['marketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['stakeUsd', getU64Encoder()],
    ]);
}

function getCreateTicketInstructionDataDecoder(): Decoder<CreateTicketInstructionArgs> {
    return getStructDecoder([
        ['ticketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['ticketIdHash', fixDecoderSize(getBytesDecoder(), 32)],
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['stakeUsd', getU64Decoder()],
    ]);
}

export interface ParsedCreateTicketInstruction {
    programId: Address;
    accounts: {
        payer: AccountMeta;
        owner: AccountMeta;
        authority: AccountMeta;
        vault: AccountMeta;
        ticket: AccountMeta;
        ownerTokenAccount: AccountMeta;
        settlementMint: AccountMeta;
        ticketAta: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateTicketInstructionArgs;
}

export function parseCreateTicketInstruction(instruction: TransactionInstruction): ParsedCreateTicketInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for CreateTicket instruction');
    }
    if (!CREATE_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateTicket instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            payer: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            authority: instruction.keys[2]!,
            vault: instruction.keys[3]!,
            ticket: instruction.keys[4]!,
            ownerTokenAccount: instruction.keys[5]!,
            settlementMint: instruction.keys[6]!,
            ticketAta: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            associatedTokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
        },
        data: getCreateTicketInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateTicketInstruction(
    accounts: CreateTicketInstructionAccounts,
    args: CreateTicketInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        vault = derived;
    }
    let ticketAta = accounts.ticketAta;
    if (!ticketAta) {
        const [derived] = await findTicketAtaPda({
            ticket: accounts.ticket,
            settlementMint: accounts.settlementMint,
        });
        ticketAta = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.settlementMint, isSigner: false, isWritable: false },
        { pubkey: ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateTicketInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_TICKET_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
