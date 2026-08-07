import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
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

export const UPDATE_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([221, 59, 30, 246, 106, 223, 137, 55]);

export interface UpdateLookupTableInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultMetadata: Address;
}

export interface UpdateLookupTableInstructionArgs {
    vaultId: number;
    lookupTable: Address;
}

function getUpdateLookupTableInstructionDataEncoder(): Encoder<UpdateLookupTableInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['lookupTable', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateLookupTableInstructionDataDecoder(): Decoder<UpdateLookupTableInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateLookupTableInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultMetadata: AccountMeta;
    };
    data: UpdateLookupTableInstructionArgs;
}

export function parseUpdateLookupTableInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateLookupTableInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateLookupTable instruction');
    }
    if (!UPDATE_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateLookupTable instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultMetadata: instruction.keys[2]!,
        },
        data: getUpdateLookupTableInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateLookupTableInstruction(
    accounts: UpdateLookupTableInstructionAccounts,
    args: UpdateLookupTableInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultMetadata, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateLookupTableInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
