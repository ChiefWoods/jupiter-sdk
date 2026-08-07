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

export const START_REWARDS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([62, 183, 108, 14, 161, 145, 121, 115]);

export interface StartRewardsInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export interface StartRewardsInstructionArgs {
    rewardAmount: number | bigint;
    duration: number | bigint;
    startTime: number | bigint;
    startTvl: number | bigint;
}

function getStartRewardsInstructionDataEncoder(): Encoder<StartRewardsInstructionArgs> {
    return getStructEncoder([
        ['rewardAmount', getU64Encoder()],
        ['duration', getU64Encoder()],
        ['startTime', getU64Encoder()],
        ['startTvl', getU64Encoder()],
    ]);
}

function getStartRewardsInstructionDataDecoder(): Decoder<StartRewardsInstructionArgs> {
    return getStructDecoder([
        ['rewardAmount', getU64Decoder()],
        ['duration', getU64Decoder()],
        ['startTime', getU64Decoder()],
        ['startTvl', getU64Decoder()],
    ]);
}

export interface ParsedStartRewardsInstruction {
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
    data: StartRewardsInstructionArgs;
}

export function parseStartRewardsInstruction(instruction: TransactionInstruction): ParsedStartRewardsInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for StartRewards instruction');
    }
    if (!START_REWARDS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('StartRewards instruction discriminator mismatch');
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
        data: getStartRewardsInstructionDataDecoder().decode(instructionData),
    };
}

export function createStartRewardsInstruction(
    accounts: StartRewardsInstructionAccounts,
    args: StartRewardsInstructionArgs,
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
    let data = Buffer.from(getStartRewardsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(START_REWARDS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
