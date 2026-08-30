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

export const INITIALIZE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([175, 175, 109, 31, 13, 152, 155, 237]);

export interface InitializeInstructionAccounts {
    sender: Address;
    inviteSigner: Address;
    inviteInfo: Address;
    systemProgram: Address;
}

export interface InitializeInstructionArgs {
    expiry: number | bigint;
    amount: number | bigint;
}

function getInitializeInstructionDataEncoder(): Encoder<InitializeInstructionArgs> {
    return getStructEncoder([
        ['expiry', getI64Encoder()],
        ['amount', getU64Encoder()],
    ]);
}

function getInitializeInstructionDataDecoder(): Decoder<InitializeInstructionArgs> {
    return getStructDecoder([
        ['expiry', getI64Decoder()],
        ['amount', getU64Decoder()],
    ]);
}

export interface ParsedInitializeInstruction {
    programId: Address;
    accounts: {
        sender: AccountMeta;
        inviteSigner: AccountMeta;
        inviteInfo: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitializeInstructionArgs;
}

export function parseInitializeInstruction(instruction: TransactionInstruction): ParsedInitializeInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for Initialize instruction');
    }
    if (!INITIALIZE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Initialize instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            sender: instruction.keys[0]!,
            inviteSigner: instruction.keys[1]!,
            inviteInfo: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitializeInstructionDataDecoder().decode(instructionData),
    };
}

export function createInitializeInstruction(
    accounts: InitializeInstructionAccounts,
    args: InitializeInstructionArgs,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.inviteSigner, isSigner: true, isWritable: false },
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitializeInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INITIALIZE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
