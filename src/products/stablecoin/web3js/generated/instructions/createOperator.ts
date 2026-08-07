import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { findNewOperatorPda } from '../pdas/newOperator';
import { getOperatorRoleDecoder, getOperatorRoleEncoder, type OperatorRoleArgs } from '../types/operatorRole';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const CREATE_OPERATOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([145, 40, 238, 75, 181, 252, 59, 11]);

export interface CreateOperatorInstructionAccounts {
    operatorAuthority: Address;
    payer: Address;
    operator: Address;
    newOperatorAuthority: Address;
    newOperator?: Address;
    systemProgram: Address;
}

export interface CreateOperatorInstructionArgs {
    role: OperatorRoleArgs;
}

function getCreateOperatorInstructionDataEncoder(): Encoder<CreateOperatorInstructionArgs> {
    return getStructEncoder([['role', getOperatorRoleEncoder()]]);
}

function getCreateOperatorInstructionDataDecoder(): Decoder<CreateOperatorInstructionArgs> {
    return getStructDecoder([['role', getOperatorRoleDecoder()]]);
}

export interface ParsedCreateOperatorInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        payer: AccountMeta;
        operator: AccountMeta;
        newOperatorAuthority: AccountMeta;
        newOperator: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateOperatorInstructionArgs;
}

export function parseCreateOperatorInstruction(instruction: TransactionInstruction): ParsedCreateOperatorInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for CreateOperator instruction');
    }
    if (!CREATE_OPERATOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateOperator instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            payer: instruction.keys[1]!,
            operator: instruction.keys[2]!,
            newOperatorAuthority: instruction.keys[3]!,
            newOperator: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
        },
        data: getCreateOperatorInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateOperatorInstruction(
    accounts: CreateOperatorInstructionAccounts,
    args: CreateOperatorInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let newOperator = accounts.newOperator;
    if (!newOperator) {
        const [derived] = await findNewOperatorPda(
            {
                newOperatorAuthority: accounts.newOperatorAuthority,
            },
            programId,
        );
        newOperator = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.newOperatorAuthority, isSigner: false, isWritable: false },
        { pubkey: newOperator, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateOperatorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_OPERATOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
