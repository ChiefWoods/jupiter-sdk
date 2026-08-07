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

export const UPDATE_MAX_SUPPLY_SHARES_INSTRUCTION_DISCRIMINATOR = new Uint8Array([179, 157, 37, 206, 176, 51, 37, 79]);

export interface UpdateMaxSupplySharesInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateMaxSupplySharesInstructionArgs {
    maxSupplyShares: number | bigint;
}

function getUpdateMaxSupplySharesInstructionDataEncoder(): Encoder<UpdateMaxSupplySharesInstructionArgs> {
    return getStructEncoder([['maxSupplyShares', getU64Encoder()]]);
}

function getUpdateMaxSupplySharesInstructionDataDecoder(): Decoder<UpdateMaxSupplySharesInstructionArgs> {
    return getStructDecoder([['maxSupplyShares', getU64Decoder()]]);
}

export interface ParsedUpdateMaxSupplySharesInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateMaxSupplySharesInstructionArgs;
}

export function parseUpdateMaxSupplySharesInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateMaxSupplySharesInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateMaxSupplyShares instruction');
    }
    if (
        !UPDATE_MAX_SUPPLY_SHARES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateMaxSupplyShares instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateMaxSupplySharesInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateMaxSupplySharesInstruction(
    accounts: UpdateMaxSupplySharesInstructionAccounts,
    args: UpdateMaxSupplySharesInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateMaxSupplySharesInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_MAX_SUPPLY_SHARES_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
