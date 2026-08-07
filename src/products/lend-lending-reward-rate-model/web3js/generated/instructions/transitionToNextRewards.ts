import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';

export const TRANSITION_TO_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    167, 50, 233, 93, 0, 178, 154, 247,
]);

export interface TransitionToNextRewardsInstructionAccounts {
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export interface ParsedTransitionToNextRewardsInstruction {
    programId: Address;
    accounts: {
        lendingRewardsAdmin: AccountMeta;
        lendingAccount: AccountMeta;
        mint: AccountMeta;
        fTokenMint: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        lendingRewardsRateModel: AccountMeta;
        lendingProgram: AccountMeta;
    };
    data: {};
}

export function parseTransitionToNextRewardsInstruction(
    instruction: TransactionInstruction,
): ParsedTransitionToNextRewardsInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for TransitionToNextRewards instruction');
    }
    if (
        !TRANSITION_TO_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('TransitionToNextRewards instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            lendingRewardsAdmin: instruction.keys[0]!,
            lendingAccount: instruction.keys[1]!,
            mint: instruction.keys[2]!,
            fTokenMint: instruction.keys[3]!,
            supplyTokenReservesLiquidity: instruction.keys[4]!,
            lendingRewardsRateModel: instruction.keys[5]!,
            lendingProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export function createTransitionToNextRewardsInstruction(
    accounts: TransitionToNextRewardsInstructionAccounts,
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingRewardsRateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(TRANSITION_TO_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
