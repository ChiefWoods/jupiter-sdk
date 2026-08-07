import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';

export const UPDATE_RATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([24, 225, 53, 189, 72, 212, 225, 178]);

export interface UpdateRateInstructionAccounts {
    lending: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    rewardsRateModel: Address;
}

export interface ParsedUpdateRateInstruction {
    programId: Address;
    accounts: {
        lending: AccountMeta;
        mint: AccountMeta;
        fTokenMint: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        rewardsRateModel: AccountMeta;
    };
    data: {};
}

export function parseUpdateRateInstruction(instruction: TransactionInstruction): ParsedUpdateRateInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for UpdateRate instruction');
    }
    if (!UPDATE_RATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateRate instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            lending: instruction.keys[0]!,
            mint: instruction.keys[1]!,
            fTokenMint: instruction.keys[2]!,
            supplyTokenReservesLiquidity: instruction.keys[3]!,
            rewardsRateModel: instruction.keys[4]!,
        },
        data: {},
    };
}

export function createUpdateRateInstruction(
    accounts: UpdateRateInstructionAccounts,
    programId: Address = LENDEARN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_RATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
