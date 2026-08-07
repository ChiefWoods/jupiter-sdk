import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_FEE_AND_REVENUE_CUT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    223, 251, 181, 7, 34, 61, 183, 122,
]);

export interface UpdateFeeAndRevenueCutInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateFeeAndRevenueCutInstructionArgs {
    fee: number;
    revenueCut: number;
}

function getUpdateFeeAndRevenueCutInstructionDataEncoder(): Encoder<UpdateFeeAndRevenueCutInstructionArgs> {
    return getStructEncoder([
        ['fee', getU32Encoder()],
        ['revenueCut', getU32Encoder()],
    ]);
}

function getUpdateFeeAndRevenueCutInstructionDataDecoder(): Decoder<UpdateFeeAndRevenueCutInstructionArgs> {
    return getStructDecoder([
        ['fee', getU32Decoder()],
        ['revenueCut', getU32Decoder()],
    ]);
}

export interface ParsedUpdateFeeAndRevenueCutInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateFeeAndRevenueCutInstructionArgs;
}

export function parseUpdateFeeAndRevenueCutInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateFeeAndRevenueCutInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateFeeAndRevenueCut instruction');
    }
    if (
        !UPDATE_FEE_AND_REVENUE_CUT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateFeeAndRevenueCut instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateFeeAndRevenueCutInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateFeeAndRevenueCutInstruction(
    accounts: UpdateFeeAndRevenueCutInstructionAccounts,
    args: UpdateFeeAndRevenueCutInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateFeeAndRevenueCutInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_FEE_AND_REVENUE_CUT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
