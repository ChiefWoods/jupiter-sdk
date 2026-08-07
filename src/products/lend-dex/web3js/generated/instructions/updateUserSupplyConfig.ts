import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    217, 239, 225, 218, 33, 49, 234, 183,
]);

export interface UpdateUserSupplyConfigInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserSupplyConfigInstructionArgs {
    expandPercent: number;
    expandDuration: number | bigint;
    baseWithdrawalLimit: number | bigint;
}

function getUpdateUserSupplyConfigInstructionDataEncoder(): Encoder<UpdateUserSupplyConfigInstructionArgs> {
    return getStructEncoder([
        ['expandPercent', getU16Encoder()],
        ['expandDuration', getU64Encoder()],
        ['baseWithdrawalLimit', getU64Encoder()],
    ]);
}

function getUpdateUserSupplyConfigInstructionDataDecoder(): Decoder<UpdateUserSupplyConfigInstructionArgs> {
    return getStructDecoder([
        ['expandPercent', getU16Decoder()],
        ['expandDuration', getU64Decoder()],
        ['baseWithdrawalLimit', getU64Decoder()],
    ]);
}

export interface ParsedUpdateUserSupplyConfigInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        position: AccountMeta;
    };
    data: UpdateUserSupplyConfigInstructionArgs;
}

export function parseUpdateUserSupplyConfigInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUserSupplyConfigInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for UpdateUserSupplyConfig instruction');
    }
    if (
        !UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateUserSupplyConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
            position: instruction.keys[3]!,
        },
        data: getUpdateUserSupplyConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserSupplyConfigInstruction(
    accounts: UpdateUserSupplyConfigInstructionAccounts,
    args: UpdateUserSupplyConfigInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUserSupplyConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
