import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';

export const DELETE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([216, 227, 84, 147, 79, 177, 152, 147]);

export interface DeleteBenefactorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    receiver: Address;
    benefactor: Address;
}

export interface ParsedDeleteBenefactorInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        receiver: AccountMeta;
        benefactor: AccountMeta;
    };
    data: {};
}

export function parseDeleteBenefactorInstruction(
    instruction: TransactionInstruction,
): ParsedDeleteBenefactorInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for DeleteBenefactor instruction');
    }
    if (!DELETE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('DeleteBenefactor instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            receiver: instruction.keys[2]!,
            benefactor: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createDeleteBenefactorInstruction(
    accounts: DeleteBenefactorInstructionAccounts,
    programId: Address = STABLECOIN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.receiver, isSigner: false, isWritable: true },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(DELETE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
