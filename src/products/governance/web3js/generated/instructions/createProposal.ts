import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getProposalInstructionDecoder,
    getProposalInstructionEncoder,
    type ProposalInstructionArgs,
} from '../types/proposalInstruction';

export const CREATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([132, 116, 68, 174, 216, 160, 198, 22]);

export interface CreateProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    smartWallet: Address;
    proposer: Address;
    payer: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateProposalInstructionArgs {
    proposalType: number;
    maxOption: number;
    instructions: Array<ProposalInstructionArgs>;
}

function getCreateProposalInstructionDataEncoder(): Encoder<CreateProposalInstructionArgs> {
    return getStructEncoder([
        ['proposalType', getU8Encoder()],
        ['maxOption', getU8Encoder()],
        ['instructions', getArrayEncoder(getProposalInstructionEncoder())],
    ]);
}

function getCreateProposalInstructionDataDecoder(): Decoder<CreateProposalInstructionArgs> {
    return getStructDecoder([
        ['proposalType', getU8Decoder()],
        ['maxOption', getU8Decoder()],
        ['instructions', getArrayDecoder(getProposalInstructionDecoder())],
    ]);
}

export interface ParsedCreateProposalInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        proposal: AccountMeta;
        smartWallet: AccountMeta;
        proposer: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateProposalInstructionArgs;
}

export function parseCreateProposalInstruction(instruction: TransactionInstruction): ParsedCreateProposalInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for CreateProposal instruction');
    }
    if (!CREATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateProposal instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            proposal: instruction.keys[1]!,
            smartWallet: instruction.keys[2]!,
            proposer: instruction.keys[3]!,
            payer: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
            eventAuthority: instruction.keys[6]!,
            program: instruction.keys[7]!,
        },
        data: getCreateProposalInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateProposalInstruction(
    accounts: CreateProposalInstructionAccounts,
    args: CreateProposalInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: false, isWritable: false },
        { pubkey: accounts.proposer, isSigner: true, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateProposalInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
