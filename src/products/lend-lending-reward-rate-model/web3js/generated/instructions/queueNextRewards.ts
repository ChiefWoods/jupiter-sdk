import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const QUEUE_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([12, 38, 248, 80, 128, 76, 155, 210]);

export interface QueueNextRewardsInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export interface QueueNextRewardsInstructionArgs {
    rewardAmount: number | bigint;
    duration: number | bigint;
}

function getQueueNextRewardsInstructionDataEncoder(): Encoder<QueueNextRewardsInstructionArgs> {
    return getStructEncoder([
        ['rewardAmount', getU64Encoder()],
        ['duration', getU64Encoder()],
    ]);
}

function getQueueNextRewardsInstructionDataDecoder(): Decoder<QueueNextRewardsInstructionArgs> {
    return getStructDecoder([
        ['rewardAmount', getU64Decoder()],
        ['duration', getU64Decoder()],
    ]);
}

export interface ParsedQueueNextRewardsInstruction {
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
    data: QueueNextRewardsInstructionArgs;
}

export function parseQueueNextRewardsInstruction(
    instruction: TransactionInstruction,
): ParsedQueueNextRewardsInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for QueueNextRewards instruction');
    }
    if (!QUEUE_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('QueueNextRewards instruction discriminator mismatch');
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
        data: getQueueNextRewardsInstructionDataDecoder().decode(instructionData),
    };
}

export function createQueueNextRewardsInstruction(
    accounts: QueueNextRewardsInstructionAccounts,
    args: QueueNextRewardsInstructionArgs,
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
    let data = Buffer.from(getQueueNextRewardsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(QUEUE_NEXT_REWARDS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
