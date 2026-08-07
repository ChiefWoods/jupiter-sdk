import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';
import { findLendingRewardsRateModelPda } from '../pdas/lendingRewardsRateModel';

export const INIT_LENDING_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    117, 123, 196, 52, 246, 90, 168, 0,
]);

export interface InitLendingRewardsRateModelInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    mint: Address;
    lendingRewardsRateModel?: Address;
    systemProgram: Address;
}

export interface ParsedInitLendingRewardsRateModelInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        lendingRewardsAdmin: AccountMeta;
        mint: AccountMeta;
        lendingRewardsRateModel: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseInitLendingRewardsRateModelInstruction(
    instruction: TransactionInstruction,
): ParsedInitLendingRewardsRateModelInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for InitLendingRewardsRateModel instruction');
    }
    if (
        !INIT_LENDING_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InitLendingRewardsRateModel instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            lendingRewardsAdmin: instruction.keys[1]!,
            mint: instruction.keys[2]!,
            lendingRewardsRateModel: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: {},
    };
}

export async function createInitLendingRewardsRateModelInstruction(
    accounts: InitLendingRewardsRateModelInstructionAccounts,
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lendingRewardsRateModel = accounts.lendingRewardsRateModel;
    if (!lendingRewardsRateModel) {
        const [derived] = await findLendingRewardsRateModelPda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        lendingRewardsRateModel = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: lendingRewardsRateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_LENDING_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
