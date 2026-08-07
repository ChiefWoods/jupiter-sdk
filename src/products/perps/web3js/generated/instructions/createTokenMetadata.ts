import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
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

export const CREATE_TOKEN_METADATA_INSTRUCTION_DISCRIMINATOR = new Uint8Array([221, 80, 176, 37, 153, 188, 160, 68]);

export interface CreateTokenMetadataInstructionAccounts {
    admin: Address;
    perpetuals: Address;
    pool: Address;
    transferAuthority: Address;
    metadata: Address;
    lpTokenMint: Address;
    tokenMetadataProgram: Address;
    systemProgram: Address;
    rent: Address;
}

export interface CreateTokenMetadataInstructionArgs {
    name: string;
    symbol: string;
    uri: string;
}

function getCreateTokenMetadataInstructionDataEncoder(): Encoder<CreateTokenMetadataInstructionArgs> {
    return getStructEncoder([
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['symbol', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['uri', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

function getCreateTokenMetadataInstructionDataDecoder(): Decoder<CreateTokenMetadataInstructionArgs> {
    return getStructDecoder([
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['symbol', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['uri', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ]);
}

export interface ParsedCreateTokenMetadataInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        transferAuthority: AccountMeta;
        metadata: AccountMeta;
        lpTokenMint: AccountMeta;
        tokenMetadataProgram: AccountMeta;
        systemProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: CreateTokenMetadataInstructionArgs;
}

export function parseCreateTokenMetadataInstruction(
    instruction: TransactionInstruction,
): ParsedCreateTokenMetadataInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for CreateTokenMetadata instruction');
    }
    if (!CREATE_TOKEN_METADATA_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateTokenMetadata instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            transferAuthority: instruction.keys[3]!,
            metadata: instruction.keys[4]!,
            lpTokenMint: instruction.keys[5]!,
            tokenMetadataProgram: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            rent: instruction.keys[8]!,
        },
        data: getCreateTokenMetadataInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateTokenMetadataInstruction(
    accounts: CreateTokenMetadataInstructionAccounts,
    args: CreateTokenMetadataInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.metadata, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenMetadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateTokenMetadataInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_TOKEN_METADATA_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
