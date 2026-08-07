import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const WITHDRAW_FEES2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([252, 128, 143, 145, 225, 221, 159, 207]);

export interface WithdrawFees2InstructionAccounts {
    keeper: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyTokenAccount: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    receivingTokenAccount: Address;
    tokenProgram: Address;
}

export interface ParsedWithdrawFees2Instruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyTokenAccount: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        receivingTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseWithdrawFees2Instruction(instruction: TransactionInstruction): ParsedWithdrawFees2Instruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for WithdrawFees2 instruction');
    }
    if (!WITHDRAW_FEES2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('WithdrawFees2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            transferAuthority: instruction.keys[1]!,
            perpetuals: instruction.keys[2]!,
            pool: instruction.keys[3]!,
            custody: instruction.keys[4]!,
            custodyTokenAccount: instruction.keys[5]!,
            custodyDovesPriceAccount: instruction.keys[6]!,
            custodyPythnetPriceAccount: instruction.keys[7]!,
            receivingTokenAccount: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
        },
        data: {},
    };
}

export function createWithdrawFees2Instruction(
    accounts: WithdrawFees2InstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.receivingTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(WITHDRAW_FEES2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
