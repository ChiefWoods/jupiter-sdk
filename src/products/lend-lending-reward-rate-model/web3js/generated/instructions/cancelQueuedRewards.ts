import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';

export const CANCEL_QUEUED_REWARDS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([253, 198, 122, 96, 234, 226, 53, 229]);

export interface CancelQueuedRewardsInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export interface ParsedCancelQueuedRewardsInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
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

export function parseCancelQueuedRewardsInstruction(
    instruction: TransactionInstruction,
): ParsedCancelQueuedRewardsInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for CancelQueuedRewards instruction');
    }
    if (!CANCEL_QUEUED_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CancelQueuedRewards instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            lendingRewardsAdmin: instruction.keys[1]!,
            lendingAccount: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            fTokenMint: instruction.keys[4]!,
            supplyTokenReservesLiquidity: instruction.keys[5]!,
            lendingRewardsRateModel: instruction.keys[6]!,
            lendingProgram: instruction.keys[7]!,
        },
        data: {},
    };
}

export function createCancelQueuedRewardsInstruction(
    accounts: CancelQueuedRewardsInstructionAccounts,
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
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
        Buffer.from(CANCEL_QUEUED_REWARDS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
