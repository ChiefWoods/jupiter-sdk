import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';
import {
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INITIALIZE_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([38, 209, 150, 50, 190, 117, 16, 54]);

export interface InitializeTokenInstructionAccounts {
    sender: Address;
    invite: Address;
    inviteInfo: Address;
    systemProgram: Address;
    senderTokenAccount: Address;
    escrowTokenAccount: Address;
    tokenProgram: Address;
    mint: Address;
    associatedTokenProgram: Address;
}

export interface InitializeTokenInstructionArgs {
    expiry: number | bigint;
    amount: number | bigint;
}

function getInitializeTokenInstructionDataEncoder(): Encoder<InitializeTokenInstructionArgs> {
    return getStructEncoder([
        ['expiry', getI64Encoder()],
        ['amount', getU64Encoder()],
    ]);
}

function getInitializeTokenInstructionDataDecoder(): Decoder<InitializeTokenInstructionArgs> {
    return getStructDecoder([
        ['expiry', getI64Decoder()],
        ['amount', getU64Decoder()],
    ]);
}

export interface ParsedInitializeTokenInstruction {
    programId: Address;
    accounts: {
        sender: AccountMeta;
        invite: AccountMeta;
        inviteInfo: AccountMeta;
        systemProgram: AccountMeta;
        senderTokenAccount: AccountMeta;
        escrowTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        mint: AccountMeta;
        associatedTokenProgram: AccountMeta;
    };
    data: InitializeTokenInstructionArgs;
}

export function parseInitializeTokenInstruction(instruction: TransactionInstruction): ParsedInitializeTokenInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for InitializeToken instruction');
    }
    if (!INITIALIZE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitializeToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            sender: instruction.keys[0]!,
            invite: instruction.keys[1]!,
            inviteInfo: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
            senderTokenAccount: instruction.keys[4]!,
            escrowTokenAccount: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            mint: instruction.keys[7]!,
            associatedTokenProgram: instruction.keys[8]!,
        },
        data: getInitializeTokenInstructionDataDecoder().decode(instructionData),
    };
}

export function createInitializeTokenInstruction(
    accounts: InitializeTokenInstructionAccounts,
    args: InitializeTokenInstructionArgs,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.invite, isSigner: true, isWritable: true },
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.senderTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitializeTokenInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INITIALIZE_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
