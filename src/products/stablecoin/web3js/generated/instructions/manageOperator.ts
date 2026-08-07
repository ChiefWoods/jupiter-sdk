import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import {
    getOperatorManagementActionDecoder,
    getOperatorManagementActionEncoder,
    type OperatorManagementActionArgs,
} from '../types/operatorManagementAction';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const MANAGE_OPERATOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([82, 172, 106, 235, 147, 246, 96, 85]);

export interface ManageOperatorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    managedOperator: Address;
    systemProgram: Address;
}

export interface ManageOperatorInstructionArgs {
    action: OperatorManagementActionArgs;
}

function getManageOperatorInstructionDataEncoder(): Encoder<ManageOperatorInstructionArgs> {
    return getStructEncoder([['action', getOperatorManagementActionEncoder()]]);
}

function getManageOperatorInstructionDataDecoder(): Decoder<ManageOperatorInstructionArgs> {
    return getStructDecoder([['action', getOperatorManagementActionDecoder()]]);
}

export interface ParsedManageOperatorInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        managedOperator: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: ManageOperatorInstructionArgs;
}

export function parseManageOperatorInstruction(instruction: TransactionInstruction): ParsedManageOperatorInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for ManageOperator instruction');
    }
    if (!MANAGE_OPERATOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ManageOperator instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            managedOperator: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getManageOperatorInstructionDataDecoder().decode(instructionData),
    };
}

export function createManageOperatorInstruction(
    accounts: ManageOperatorInstructionAccounts,
    args: ManageOperatorInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.managedOperator, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getManageOperatorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MANAGE_OPERATOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
