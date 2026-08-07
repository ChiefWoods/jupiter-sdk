import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const NEW_VOTE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([163, 108, 157, 189, 140, 80, 13, 143]);

export interface NewVoteInstructionAccounts {
    proposal: Address;
    vote: Address;
    payer: Address;
    systemProgram: Address;
}

export interface NewVoteInstructionArgs {
    voter: Address;
}

function getNewVoteInstructionDataEncoder(): Encoder<NewVoteInstructionArgs> {
    return getStructEncoder([
        ['voter', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getNewVoteInstructionDataDecoder(): Decoder<NewVoteInstructionArgs> {
    return getStructDecoder([
        ['voter', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedNewVoteInstruction {
    programId: Address;
    accounts: {
        proposal: AccountMeta;
        vote: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: NewVoteInstructionArgs;
}

export function parseNewVoteInstruction(instruction: TransactionInstruction): ParsedNewVoteInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for NewVote instruction');
    }
    if (!NEW_VOTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('NewVote instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            proposal: instruction.keys[0]!,
            vote: instruction.keys[1]!,
            payer: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getNewVoteInstructionDataDecoder().decode(instructionData),
    };
}

export function createNewVoteInstruction(
    accounts: NewVoteInstructionAccounts,
    args: NewVoteInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.proposal, isSigner: false, isWritable: false },
        { pubkey: accounts.vote, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getNewVoteInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(NEW_VOTE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
