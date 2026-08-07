import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';

export const PAUSE_PROTOCOL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([144, 95, 0, 107, 119, 39, 248, 141]);

export interface PauseProtocolInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export interface ParsedPauseProtocolInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        flashloanAdmin: AccountMeta;
    };
    data: {};
}

export function parsePauseProtocolInstruction(instruction: TransactionInstruction): ParsedPauseProtocolInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for PauseProtocol instruction');
    }
    if (!PAUSE_PROTOCOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PauseProtocol instruction discriminator mismatch');
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

export function createPauseProtocolInstruction(
    accounts: PauseProtocolInstructionAccounts,
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
        Buffer.from(PAUSE_PROTOCOL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
