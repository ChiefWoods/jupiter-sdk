import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';

export const ACTIVATE_PROTOCOL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([230, 235, 188, 19, 120, 91, 11, 94]);

export interface ActivateProtocolInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export interface ParsedActivateProtocolInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        flashloanAdmin: AccountMeta;
    };
    data: {};
}

export function parseActivateProtocolInstruction(
    instruction: TransactionInstruction,
): ParsedActivateProtocolInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for ActivateProtocol instruction');
    }
    if (!ACTIVATE_PROTOCOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ActivateProtocol instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            flashloanAdmin: instruction.keys[1]!,
        },
        data: {},
    };
}

export function createActivateProtocolInstruction(
    accounts: ActivateProtocolInstructionAccounts,
    programId: Address = LENDFLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ACTIVATE_PROTOCOL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
