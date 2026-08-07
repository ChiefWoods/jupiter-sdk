import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getArrayDecoder,
    getArrayEncoder,
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

export const CREATE_OPTION_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    152, 144, 104, 228, 245, 234, 164, 224,
]);

export interface CreateOptionProposalMetaInstructionAccounts {
    proposal: Address;
    proposer: Address;
    optionProposalMeta: Address;
    payer: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateOptionProposalMetaInstructionArgs {
    bump: number;
    optionDescriptions: Array<string>;
}

function getCreateOptionProposalMetaInstructionDataEncoder(): Encoder<CreateOptionProposalMetaInstructionArgs> {
    return getStructEncoder([
        ['bump', getU8Encoder()],
        ['optionDescriptions', getArrayEncoder(addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder()))],
    ]);
}

function getCreateOptionProposalMetaInstructionDataDecoder(): Decoder<CreateOptionProposalMetaInstructionArgs> {
    return getStructDecoder([
        ['bump', getU8Decoder()],
        ['optionDescriptions', getArrayDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
    ]);
}

export interface ParsedCreateOptionProposalMetaInstruction {
    programId: Address;
    accounts: {
        proposal: AccountMeta;
        proposer: AccountMeta;
        optionProposalMeta: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateOptionProposalMetaInstructionArgs;
}

export function parseCreateOptionProposalMetaInstruction(
    instruction: TransactionInstruction,
): ParsedCreateOptionProposalMetaInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for CreateOptionProposalMeta instruction');
    }
    if (
        !CREATE_OPTION_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateOptionProposalMeta instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            proposal: instruction.keys[0]!,
            proposer: instruction.keys[1]!,
            optionProposalMeta: instruction.keys[2]!,
            payer: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
            eventAuthority: instruction.keys[5]!,
            program: instruction.keys[6]!,
        },
        data: getCreateOptionProposalMetaInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateOptionProposalMetaInstruction(
    accounts: CreateOptionProposalMetaInstructionAccounts,
    args: CreateOptionProposalMetaInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.proposal, isSigner: false, isWritable: false },
        { pubkey: accounts.proposer, isSigner: true, isWritable: false },
        { pubkey: accounts.optionProposalMeta, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateOptionProposalMetaInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_OPTION_PROPOSAL_META_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
