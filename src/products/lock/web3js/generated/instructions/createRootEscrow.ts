import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const CREATE_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([116, 212, 12, 188, 77, 226, 32, 201]);

export interface CreateRootEscrowInstructionAccounts {
    base: Address;
    rootEscrow: Address;
    tokenMint: Address;
    payer: Address;
    creator: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateRootEscrowInstructionArgs {
    maxClaimAmount: number | bigint;
    maxEscrow: number | bigint;
    version: number | bigint;
    root: ReadonlyUint8Array;
}

function getCreateRootEscrowInstructionDataEncoder(): Encoder<CreateRootEscrowInstructionArgs> {
    return getStructEncoder([
        ['maxClaimAmount', getU64Encoder()],
        ['maxEscrow', getU64Encoder()],
        ['version', getU64Encoder()],
        ['root', fixEncoderSize(getBytesEncoder(), 32)],
    ]);
}

function getCreateRootEscrowInstructionDataDecoder(): Decoder<CreateRootEscrowInstructionArgs> {
    return getStructDecoder([
        ['maxClaimAmount', getU64Decoder()],
        ['maxEscrow', getU64Decoder()],
        ['version', getU64Decoder()],
        ['root', fixDecoderSize(getBytesDecoder(), 32)],
    ]);
}

export interface ParsedCreateRootEscrowInstruction {
    programId: Address;
    accounts: {
        base: AccountMeta;
        rootEscrow: AccountMeta;
        tokenMint: AccountMeta;
        payer: AccountMeta;
        creator: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateRootEscrowInstructionArgs;
}

export function parseCreateRootEscrowInstruction(
    instruction: TransactionInstruction,
): ParsedCreateRootEscrowInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for CreateRootEscrow instruction');
    }
    if (!CREATE_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateRootEscrow instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            base: instruction.keys[0]!,
            rootEscrow: instruction.keys[1]!,
            tokenMint: instruction.keys[2]!,
            payer: instruction.keys[3]!,
            creator: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
            eventAuthority: instruction.keys[6]!,
            program: instruction.keys[7]!,
        },
        data: getCreateRootEscrowInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateRootEscrowInstruction(
    accounts: CreateRootEscrowInstructionAccounts,
    args: CreateRootEscrowInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: false },
        { pubkey: accounts.rootEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.creator, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateRootEscrowInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
