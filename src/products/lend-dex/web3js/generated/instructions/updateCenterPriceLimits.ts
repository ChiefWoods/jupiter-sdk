import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_CENTER_PRICE_LIMITS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    17, 23, 56, 200, 237, 163, 24, 152,
]);

export interface UpdateCenterPriceLimitsInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateCenterPriceLimitsInstructionArgs {
    maxCenterPrice: number | bigint;
    minCenterPrice: number | bigint;
}

function getUpdateCenterPriceLimitsInstructionDataEncoder(): Encoder<UpdateCenterPriceLimitsInstructionArgs> {
    return getStructEncoder([
        ['maxCenterPrice', getU64Encoder()],
        ['minCenterPrice', getU64Encoder()],
    ]);
}

function getUpdateCenterPriceLimitsInstructionDataDecoder(): Decoder<UpdateCenterPriceLimitsInstructionArgs> {
    return getStructDecoder([
        ['maxCenterPrice', getU64Decoder()],
        ['minCenterPrice', getU64Decoder()],
    ]);
}

export interface ParsedUpdateCenterPriceLimitsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateCenterPriceLimitsInstructionArgs;
}

export function parseUpdateCenterPriceLimitsInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateCenterPriceLimitsInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateCenterPriceLimits instruction');
    }
    if (
        !UPDATE_CENTER_PRICE_LIMITS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateCenterPriceLimits instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateCenterPriceLimitsInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateCenterPriceLimitsInstruction(
    accounts: UpdateCenterPriceLimitsInstructionAccounts,
    args: UpdateCenterPriceLimitsInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateCenterPriceLimitsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_CENTER_PRICE_LIMITS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
