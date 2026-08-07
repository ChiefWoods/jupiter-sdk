import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getI16Decoder,
    getI16Encoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_SUPPLY_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    175, 59, 117, 196, 211, 170, 22, 12,
]);

export interface UpdateSupplyRateMagnifierInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateSupplyRateMagnifierInstructionArgs {
    vaultId: number;
    supplyRateMagnifier: number;
}

function getUpdateSupplyRateMagnifierInstructionDataEncoder(): Encoder<UpdateSupplyRateMagnifierInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['supplyRateMagnifier', getI16Encoder()],
    ]);
}

function getUpdateSupplyRateMagnifierInstructionDataDecoder(): Decoder<UpdateSupplyRateMagnifierInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['supplyRateMagnifier', getI16Decoder()],
    ]);
}

export interface ParsedUpdateSupplyRateMagnifierInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateSupplyRateMagnifierInstructionArgs;
}

export function parseUpdateSupplyRateMagnifierInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateSupplyRateMagnifierInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateSupplyRateMagnifier instruction');
    }
    if (
        !UPDATE_SUPPLY_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateSupplyRateMagnifier instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultState: instruction.keys[2]!,
            vaultConfig: instruction.keys[3]!,
            supplyTokenReservesLiquidity: instruction.keys[4]!,
            borrowTokenReservesLiquidity: instruction.keys[5]!,
        },
        data: getUpdateSupplyRateMagnifierInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateSupplyRateMagnifierInstruction(
    accounts: UpdateSupplyRateMagnifierInstructionAccounts,
    args: UpdateSupplyRateMagnifierInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateSupplyRateMagnifierInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_SUPPLY_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
