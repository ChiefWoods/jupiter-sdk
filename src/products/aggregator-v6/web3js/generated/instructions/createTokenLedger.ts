import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';

export const CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([232, 242, 197, 253, 240, 143, 129, 52]);

export interface CreateTokenLedgerInstructionAccounts {
    tokenLedger: Address;
    payer: Address;
    systemProgram: Address;
}

export interface ParsedCreateTokenLedgerInstruction {
    programId: Address;
    accounts: {
        tokenLedger: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseCreateTokenLedgerInstruction(
    instruction: TransactionInstruction,
): ParsedCreateTokenLedgerInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for CreateTokenLedger instruction');
    }
    if (!CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateTokenLedger instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenLedger: instruction.keys[0]!,
            payer: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createCreateTokenLedgerInstruction(
    accounts: CreateTokenLedgerInstructionAccounts,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenLedger, isSigner: true, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
