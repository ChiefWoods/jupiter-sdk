import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
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

export const UPDATE_DEX_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([87, 149, 96, 95, 24, 20, 211, 43]);

export interface UpdateDexLookupTableInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dexMetadata: Address;
}

export interface UpdateDexLookupTableInstructionArgs {
    dexId: number;
    lookupTable: Address;
}

function getUpdateDexLookupTableInstructionDataEncoder(): Encoder<UpdateDexLookupTableInstructionArgs> {
    return getStructEncoder([
        ['dexId', getU16Encoder()],
        ['lookupTable', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateDexLookupTableInstructionDataDecoder(): Decoder<UpdateDexLookupTableInstructionArgs> {
    return getStructDecoder([
        ['dexId', getU16Decoder()],
        ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateDexLookupTableInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dexMetadata: AccountMeta;
    };
    data: UpdateDexLookupTableInstructionArgs;
}

export function parseUpdateDexLookupTableInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateDexLookupTableInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateDexLookupTable instruction');
    }
    if (
        !UPDATE_DEX_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateDexLookupTable instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dexMetadata: instruction.keys[2]!,
        },
        data: getUpdateDexLookupTableInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateDexLookupTableInstruction(
    accounts: UpdateDexLookupTableInstructionAccounts,
    args: UpdateDexLookupTableInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dexMetadata, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateDexLookupTableInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_DEX_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
