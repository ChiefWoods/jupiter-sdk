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

export const MIGRATE_VAULT_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    241, 231, 0, 150, 218, 48, 154, 189,
]);

export interface MigrateVaultContractUnitsInstructionAccounts {
    admin: Address;
    vault: Address;
}

export interface MigrateVaultContractUnitsInstructionArgs {
    expectedCurrentContracts: number | bigint;
    expectedGlobalMaxContracts: number | bigint;
    expectedPositionMaxContracts: number | bigint;
}

function getMigrateVaultContractUnitsInstructionDataEncoder(): Encoder<MigrateVaultContractUnitsInstructionArgs> {
    return getStructEncoder([
        ['expectedCurrentContracts', getU64Encoder()],
        ['expectedGlobalMaxContracts', getU64Encoder()],
        ['expectedPositionMaxContracts', getU64Encoder()],
    ]);
}

function getMigrateVaultContractUnitsInstructionDataDecoder(): Decoder<MigrateVaultContractUnitsInstructionArgs> {
    return getStructDecoder([
        ['expectedCurrentContracts', getU64Decoder()],
        ['expectedGlobalMaxContracts', getU64Decoder()],
        ['expectedPositionMaxContracts', getU64Decoder()],
    ]);
}

export interface ParsedMigrateVaultContractUnitsInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        vault: AccountMeta;
    };
    data: MigrateVaultContractUnitsInstructionArgs;
}

export function parseMigrateVaultContractUnitsInstruction(
    instruction: TransactionInstruction,
): ParsedMigrateVaultContractUnitsInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for MigrateVaultContractUnits instruction');
    }
    if (
        !MIGRATE_VAULT_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('MigrateVaultContractUnits instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            vault: instruction.keys[1]!,
        },
        data: getMigrateVaultContractUnitsInstructionDataDecoder().decode(instructionData),
    };
}

export function createMigrateVaultContractUnitsInstruction(
    accounts: MigrateVaultContractUnitsInstructionAccounts,
    args: MigrateVaultContractUnitsInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getMigrateVaultContractUnitsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MIGRATE_VAULT_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
