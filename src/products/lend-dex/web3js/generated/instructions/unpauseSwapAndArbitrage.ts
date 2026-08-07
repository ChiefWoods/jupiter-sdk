import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';

export const UNPAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    241, 4, 197, 110, 244, 255, 172, 184,
]);

export interface UnpauseSwapAndArbitrageInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface ParsedUnpauseSwapAndArbitrageInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: {};
}

export function parseUnpauseSwapAndArbitrageInstruction(
    instruction: TransactionInstruction,
): ParsedUnpauseSwapAndArbitrageInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UnpauseSwapAndArbitrage instruction');
    }
    if (
        !UNPAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UnpauseSwapAndArbitrage instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createUnpauseSwapAndArbitrageInstruction(
    accounts: UnpauseSwapAndArbitrageInstructionAccounts,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UNPAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
