import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';

export const SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([228, 85, 185, 112, 78, 79, 77, 2]);

export interface SetTokenLedgerInstructionAccounts {
    tokenLedger: Address;
    tokenAccount: Address;
}

export interface ParsedSetTokenLedgerInstruction {
    programId: Address;
    accounts: {
        tokenLedger: AccountMeta;
        tokenAccount: AccountMeta;
    };
    data: {};
}

export function parseSetTokenLedgerInstruction(instruction: TransactionInstruction): ParsedSetTokenLedgerInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetTokenLedger instruction');
    }
    if (!SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetTokenLedger instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenLedger: instruction.keys[0]!,
            tokenAccount: instruction.keys[1]!,
        },
        data: {},
    };
}

export function createSetTokenLedgerInstruction(
    accounts: SetTokenLedgerInstructionAccounts,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenLedger, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenAccount, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
