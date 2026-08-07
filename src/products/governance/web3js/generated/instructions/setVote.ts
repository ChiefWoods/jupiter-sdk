import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SET_VOTE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([171, 33, 83, 172, 148, 215, 239, 97]);

export interface SetVoteInstructionAccounts {
    governor: Address;
    proposal: Address;
    vote: Address;
    locker: Address;
}

export interface SetVoteInstructionArgs {
    side: number;
    weight: number | bigint;
}

function getSetVoteInstructionDataEncoder(): Encoder<SetVoteInstructionArgs> {
    return getStructEncoder([
        ['side', getU8Encoder()],
        ['weight', getU64Encoder()],
    ]);
}

function getSetVoteInstructionDataDecoder(): Decoder<SetVoteInstructionArgs> {
    return getStructDecoder([
        ['side', getU8Decoder()],
        ['weight', getU64Decoder()],
    ]);
}

export interface ParsedSetVoteInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        proposal: AccountMeta;
        vote: AccountMeta;
        locker: AccountMeta;
    };
    data: SetVoteInstructionArgs;
}

export function parseSetVoteInstruction(instruction: TransactionInstruction): ParsedSetVoteInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for SetVote instruction');
    }
    if (!SET_VOTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetVote instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            proposal: instruction.keys[1]!,
            vote: instruction.keys[2]!,
            locker: instruction.keys[3]!,
        },
        data: getSetVoteInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetVoteInstruction(
    accounts: SetVoteInstructionAccounts,
    args: SetVoteInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.vote, isSigner: false, isWritable: true },
        { pubkey: accounts.locker, isSigner: true, isWritable: false },
    ];
    let data = Buffer.from(getSetVoteInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_VOTE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
