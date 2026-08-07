import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU8Decoder,
    getU8Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR = new Uint8Array([238, 138, 212, 160, 46, 53, 51, 88]);

export interface CreateProposalMetaInstructionAccounts {
    proposal: Address;
    proposer: Address;
    proposalMeta: Address;
    payer: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateProposalMetaInstructionArgs {
    bump: number;
    title: string;
    descriptionLink: string;
}

function getCreateProposalMetaInstructionDataEncoder(): Encoder<CreateProposalMetaInstructionArgs> {
    return getStructEncoder([
        ['bump', getU8Encoder()],
        ['title', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['descriptionLink', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

function getCreateProposalMetaInstructionDataDecoder(): Decoder<CreateProposalMetaInstructionArgs> {
    return getStructDecoder([
        ['bump', getU8Decoder()],
        ['title', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['descriptionLink', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ]);
}

export interface ParsedCreateProposalMetaInstruction {
    programId: Address;
    accounts: {
        proposal: AccountMeta;
        proposer: AccountMeta;
        proposalMeta: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateProposalMetaInstructionArgs;
}

export function parseCreateProposalMetaInstruction(
    instruction: TransactionInstruction,
): ParsedCreateProposalMetaInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for CreateProposalMeta instruction');
    }
    if (!CREATE_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateProposalMeta instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            proposal: instruction.keys[0]!,
            proposer: instruction.keys[1]!,
            proposalMeta: instruction.keys[2]!,
            payer: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
            eventAuthority: instruction.keys[5]!,
            program: instruction.keys[6]!,
        },
        data: getCreateProposalMetaInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateProposalMetaInstruction(
    accounts: CreateProposalMetaInstructionAccounts,
    args: CreateProposalMetaInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.proposal, isSigner: false, isWritable: false },
        { pubkey: accounts.proposer, isSigner: true, isWritable: false },
        { pubkey: accounts.proposalMeta, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateProposalMetaInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
