import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const TRANSFER_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([42, 242, 66, 106, 228, 10, 111, 156]);

export interface TransferAdminInstructionAccounts {
    admin: Address;
    newAdmin: Address;
    perpetuals: Address;
}

export interface ParsedTransferAdminInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        newAdmin: AccountMeta;
        perpetuals: AccountMeta;
    };
    data: {};
}

export function parseTransferAdminInstruction(instruction: TransactionInstruction): ParsedTransferAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for TransferAdmin instruction');
    }
    if (!TRANSFER_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('TransferAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            newAdmin: instruction.keys[1]!,
            perpetuals: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createTransferAdminInstruction(
    accounts: TransferAdminInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.newAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(TRANSFER_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
