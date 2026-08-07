import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import { findDexMetadataPda } from '../pdas/dexMetadata';
import { findDexPda } from '../pdas/dex';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_DEX_METADATA_INSTRUCTION_DISCRIMINATOR = new Uint8Array([114, 167, 144, 220, 143, 73, 224, 8]);

export interface InitDexMetadataInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex?: Address;
    dexMetadata?: Address;
    systemProgram: Address;
}

export interface InitDexMetadataInstructionArgs {
    dexId: number;
    lookupTable: Address;
}

function getInitDexMetadataInstructionDataEncoder(): Encoder<InitDexMetadataInstructionArgs> {
    return getStructEncoder([
        ['dexId', getU16Encoder()],
        ['lookupTable', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitDexMetadataInstructionDataDecoder(): Decoder<InitDexMetadataInstructionArgs> {
    return getStructDecoder([
        ['dexId', getU16Decoder()],
        ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitDexMetadataInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        dexMetadata: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitDexMetadataInstructionArgs;
}

export function parseInitDexMetadataInstruction(instruction: TransactionInstruction): ParsedInitDexMetadataInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for InitDexMetadata instruction');
    }
    if (!INIT_DEX_METADATA_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitDexMetadata instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
            dexMetadata: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: getInitDexMetadataInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitDexMetadataInstruction(
    accounts: InitDexMetadataInstructionAccounts,
    args: InitDexMetadataInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let dex = accounts.dex;
    if (!dex) {
        const [derived] = await findDexPda(
            {
                dexId: args.dexId,
            },
            programId,
        );
        dex = derived;
    }
    let dexMetadata = accounts.dexMetadata;
    if (!dexMetadata) {
        const [derived] = await findDexMetadataPda(
            {
                dexId: args.dexId,
            },
            programId,
        );
        dexMetadata = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: dex, isSigner: false, isWritable: false },
        { pubkey: dexMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitDexMetadataInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_DEX_METADATA_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
