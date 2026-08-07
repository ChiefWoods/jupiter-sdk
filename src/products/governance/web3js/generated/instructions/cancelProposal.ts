import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';

export const CANCEL_PROPOSAL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([106, 74, 128, 146, 19, 65, 39, 23]);

export interface CancelProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    proposer: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedCancelProposalInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        proposal: AccountMeta;
        proposer: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseCancelProposalInstruction(instruction: TransactionInstruction): ParsedCancelProposalInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for CancelProposal instruction');
    }
    if (!CANCEL_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CancelProposal instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            proposal: instruction.keys[1]!,
            proposer: instruction.keys[2]!,
            eventAuthority: instruction.keys[3]!,
            program: instruction.keys[4]!,
        },
        data: {},
    };
}

export function createCancelProposalInstruction(
    accounts: CancelProposalInstructionAccounts,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.proposer, isSigner: true, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CANCEL_PROPOSAL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
