import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getI16Decoder,
    getI16Encoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_CORE_SETTINGS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([101, 84, 9, 11, 60, 104, 149, 234]);

export interface UpdateCoreSettingsInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateCoreSettingsInstructionArgs {
    vaultId: number;
    supplyRateMagnifier: number;
    borrowRateMagnifier: number;
    collateralFactor: number;
    liquidationThreshold: number;
    liquidationMaxLimit: number;
    withdrawGap: number;
    liquidationPenalty: number;
    borrowFee: number;
}

function getUpdateCoreSettingsInstructionDataEncoder(): Encoder<UpdateCoreSettingsInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['supplyRateMagnifier', getI16Encoder()],
        ['borrowRateMagnifier', getI16Encoder()],
        ['collateralFactor', getU16Encoder()],
        ['liquidationThreshold', getU16Encoder()],
        ['liquidationMaxLimit', getU16Encoder()],
        ['withdrawGap', getU16Encoder()],
        ['liquidationPenalty', getU16Encoder()],
        ['borrowFee', getU8Encoder()],
    ]);
}

function getUpdateCoreSettingsInstructionDataDecoder(): Decoder<UpdateCoreSettingsInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['supplyRateMagnifier', getI16Decoder()],
        ['borrowRateMagnifier', getI16Decoder()],
        ['collateralFactor', getU16Decoder()],
        ['liquidationThreshold', getU16Decoder()],
        ['liquidationMaxLimit', getU16Decoder()],
        ['withdrawGap', getU16Decoder()],
        ['liquidationPenalty', getU16Decoder()],
        ['borrowFee', getU8Decoder()],
    ]);
}

export interface ParsedUpdateCoreSettingsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateCoreSettingsInstructionArgs;
}

export function parseUpdateCoreSettingsInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateCoreSettingsInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateCoreSettings instruction');
    }
    if (!UPDATE_CORE_SETTINGS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateCoreSettings instruction discriminator mismatch');
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
        data: getUpdateCoreSettingsInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateCoreSettingsInstruction(
    accounts: UpdateCoreSettingsInstructionAccounts,
    args: UpdateCoreSettingsInstructionArgs,
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
    let data = Buffer.from(getUpdateCoreSettingsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_CORE_SETTINGS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
