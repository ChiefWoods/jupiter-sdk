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

export const UPDATE_ORACLE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([112, 41, 209, 18, 248, 226, 252, 188]);

export interface UpdateOracleInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    newOracle: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateOracleInstructionArgs {
    vaultId: number;
}

function getUpdateOracleInstructionDataEncoder(): Encoder<UpdateOracleInstructionArgs> {
    return getStructEncoder([['vaultId', getU16Encoder()]]);
}

function getUpdateOracleInstructionDataDecoder(): Decoder<UpdateOracleInstructionArgs> {
    return getStructDecoder([['vaultId', getU16Decoder()]]);
}

export interface ParsedUpdateOracleInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        newOracle: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateOracleInstructionArgs;
}

export function parseUpdateOracleInstruction(instruction: TransactionInstruction): ParsedUpdateOracleInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for UpdateOracle instruction');
    }
    if (!UPDATE_ORACLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateOracle instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultState: instruction.keys[2]!,
            vaultConfig: instruction.keys[3]!,
            newOracle: instruction.keys[4]!,
            supplyTokenReservesLiquidity: instruction.keys[5]!,
            borrowTokenReservesLiquidity: instruction.keys[6]!,
        },
        data: getUpdateOracleInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateOracleInstruction(
    accounts: UpdateOracleInstructionAccounts,
    args: UpdateOracleInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.newOracle, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateOracleInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_ORACLE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
