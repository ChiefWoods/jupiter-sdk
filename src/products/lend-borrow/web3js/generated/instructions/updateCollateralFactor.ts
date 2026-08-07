import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_COLLATERAL_FACTOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    244, 83, 227, 215, 220, 82, 201, 221,
]);

export interface UpdateCollateralFactorInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateCollateralFactorInstructionArgs {
    vaultId: number;
    collateralFactor: number;
}

function getUpdateCollateralFactorInstructionDataEncoder(): Encoder<UpdateCollateralFactorInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['collateralFactor', getU16Encoder()],
    ]);
}

function getUpdateCollateralFactorInstructionDataDecoder(): Decoder<UpdateCollateralFactorInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['collateralFactor', getU16Decoder()],
    ]);
}

export interface ParsedUpdateCollateralFactorInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateCollateralFactorInstructionArgs;
}

export function parseUpdateCollateralFactorInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateCollateralFactorInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateCollateralFactor instruction');
    }
    if (
        !UPDATE_COLLATERAL_FACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateCollateralFactor instruction discriminator mismatch');
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
        data: getUpdateCollateralFactorInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateCollateralFactorInstruction(
    accounts: UpdateCollateralFactorInstructionAccounts,
    args: UpdateCollateralFactorInstructionArgs,
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
    let data = Buffer.from(getUpdateCollateralFactorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_COLLATERAL_FACTOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
