import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SET_VOTING_REWARD_INSTRUCTION_DISCRIMINATOR = new Uint8Array([227, 241, 48, 137, 30, 26, 104, 70]);

export interface SetVotingRewardInstructionAccounts {
    governor: Address;
    rewardMint: Address;
    smartWallet: Address;
}

export interface SetVotingRewardInstructionArgs {
    rewardPerProposal: number | bigint;
}

function getSetVotingRewardInstructionDataEncoder(): Encoder<SetVotingRewardInstructionArgs> {
    return getStructEncoder([['rewardPerProposal', getU64Encoder()]]);
}

function getSetVotingRewardInstructionDataDecoder(): Decoder<SetVotingRewardInstructionArgs> {
    return getStructDecoder([['rewardPerProposal', getU64Decoder()]]);
}

export interface ParsedSetVotingRewardInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        rewardMint: AccountMeta;
        smartWallet: AccountMeta;
    };
    data: SetVotingRewardInstructionArgs;
}

export function parseSetVotingRewardInstruction(instruction: TransactionInstruction): ParsedSetVotingRewardInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SetVotingReward instruction');
    }
    if (!SET_VOTING_REWARD_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetVotingReward instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            rewardMint: instruction.keys[1]!,
            smartWallet: instruction.keys[2]!,
        },
        data: getSetVotingRewardInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetVotingRewardInstruction(
    accounts: SetVotingRewardInstructionAccounts,
    args: SetVotingRewardInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    let data = Buffer.from(getSetVotingRewardInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_VOTING_REWARD_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
