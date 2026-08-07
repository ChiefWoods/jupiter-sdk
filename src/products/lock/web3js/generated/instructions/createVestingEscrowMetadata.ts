import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { findEscrowMetadataPda } from '../pdas/escrowMetadata';

export const CREATE_VESTING_ESCROW_METADATA_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    93, 78, 33, 103, 173, 125, 70, 0,
]);

export interface CreateVestingEscrowMetadataInstructionAccounts {
    escrow: Address;
    creator: Address;
    escrowMetadata?: Address;
    payer: Address;
    systemProgram: Address;
}

export interface CreateVestingEscrowMetadataInstructionArgs {
    name: string;
    description: string;
    creatorEmail: string;
    recipientEmail: string;
}

function getCreateVestingEscrowMetadataInstructionDataEncoder(): Encoder<CreateVestingEscrowMetadataInstructionArgs> {
    return getStructEncoder([
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['description', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['creatorEmail', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['recipientEmail', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

function getCreateVestingEscrowMetadataInstructionDataDecoder(): Decoder<CreateVestingEscrowMetadataInstructionArgs> {
    return getStructDecoder([
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['description', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['creatorEmail', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['recipientEmail', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ]);
}

export interface ParsedCreateVestingEscrowMetadataInstruction {
    programId: Address;
    accounts: {
        escrow: AccountMeta;
        creator: AccountMeta;
        escrowMetadata: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateVestingEscrowMetadataInstructionArgs;
}

export function parseCreateVestingEscrowMetadataInstruction(
    instruction: TransactionInstruction,
): ParsedCreateVestingEscrowMetadataInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for CreateVestingEscrowMetadata instruction');
    }
    if (
        !CREATE_VESTING_ESCROW_METADATA_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateVestingEscrowMetadata instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            escrow: instruction.keys[0]!,
            creator: instruction.keys[1]!,
            escrowMetadata: instruction.keys[2]!,
            payer: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: getCreateVestingEscrowMetadataInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateVestingEscrowMetadataInstruction(
    accounts: CreateVestingEscrowMetadataInstructionAccounts,
    args: CreateVestingEscrowMetadataInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrowMetadata = accounts.escrowMetadata;
    if (!escrowMetadata) {
        const [derived] = await findEscrowMetadataPda(
            {
                escrow: accounts.escrow,
            },
            programId,
        );
        escrowMetadata = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.creator, isSigner: true, isWritable: false },
        { pubkey: escrowMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateVestingEscrowMetadataInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_VESTING_ESCROW_METADATA_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
