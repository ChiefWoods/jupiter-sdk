import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const WITHDRAW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([183, 18, 70, 156, 148, 109, 161, 34]);

export interface WithdrawInstructionAccounts {
    admin: Address;
    vault: Address;
    destinationTokenAccount: Address;
    vaultTokenAccount: Address;
    tokenProgram: Address;
}

export interface WithdrawInstructionArgs {
    amount: number | bigint;
}

function getWithdrawInstructionDataEncoder(): Encoder<WithdrawInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getWithdrawInstructionDataDecoder(): Decoder<WithdrawInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedWithdrawInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        vault: AccountMeta;
        destinationTokenAccount: AccountMeta;
        vaultTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: WithdrawInstructionArgs;
}

export function parseWithdrawInstruction(instruction: TransactionInstruction): ParsedWithdrawInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for Withdraw instruction');
    }
    if (!WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Withdraw instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            vault: instruction.keys[1]!,
            destinationTokenAccount: instruction.keys[2]!,
            vaultTokenAccount: instruction.keys[3]!,
            tokenProgram: instruction.keys[4]!,
        },
        data: getWithdrawInstructionDataDecoder().decode(instructionData),
    };
}

export function createWithdrawInstruction(
    accounts: WithdrawInstructionAccounts,
    args: WithdrawInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getWithdrawInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(WITHDRAW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
