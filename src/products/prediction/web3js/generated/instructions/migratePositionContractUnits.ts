import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const MIGRATE_POSITION_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    135, 168, 252, 245, 45, 145, 194, 160,
]);

export interface MigratePositionContractUnitsInstructionAccounts {
    admin: Address;
    vault: Address;
    position: Address;
    systemProgram: Address;
}

export interface MigratePositionContractUnitsInstructionArgs {
    expectedContracts: number | bigint;
}

function getMigratePositionContractUnitsInstructionDataEncoder(): Encoder<MigratePositionContractUnitsInstructionArgs> {
    return getStructEncoder([['expectedContracts', getU64Encoder()]]);
}

function getMigratePositionContractUnitsInstructionDataDecoder(): Decoder<MigratePositionContractUnitsInstructionArgs> {
    return getStructDecoder([['expectedContracts', getU64Decoder()]]);
}

export interface ParsedMigratePositionContractUnitsInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        vault: AccountMeta;
        position: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: MigratePositionContractUnitsInstructionArgs;
}

export function parseMigratePositionContractUnitsInstruction(
    instruction: TransactionInstruction,
): ParsedMigratePositionContractUnitsInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for MigratePositionContractUnits instruction');
    }
    if (
        !MIGRATE_POSITION_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('MigratePositionContractUnits instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            vault: instruction.keys[1]!,
            position: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getMigratePositionContractUnitsInstructionDataDecoder().decode(instructionData),
    };
}

export function createMigratePositionContractUnitsInstruction(
    accounts: MigratePositionContractUnitsInstructionAccounts,
    args: MigratePositionContractUnitsInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getMigratePositionContractUnitsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MIGRATE_POSITION_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
