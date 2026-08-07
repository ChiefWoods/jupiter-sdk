import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';

export const DELETE_OPERATOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([208, 84, 168, 116, 138, 201, 98, 16]);

export interface DeleteOperatorInstructionAccounts {
    operatorAuthority: Address;
    payer: Address;
    operator: Address;
    deletedOperator: Address;
}

export interface ParsedDeleteOperatorInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        payer: AccountMeta;
        operator: AccountMeta;
        deletedOperator: AccountMeta;
    };
    data: {};
}

export function parseDeleteOperatorInstruction(instruction: TransactionInstruction): ParsedDeleteOperatorInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for DeleteOperator instruction');
    }
    if (!DELETE_OPERATOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('DeleteOperator instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            payer: instruction.keys[1]!,
            operator: instruction.keys[2]!,
            deletedOperator: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createDeleteOperatorInstruction(
    accounts: DeleteOperatorInstructionAccounts,
    programId: Address = STABLECOIN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.deletedOperator, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(DELETE_OPERATOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
