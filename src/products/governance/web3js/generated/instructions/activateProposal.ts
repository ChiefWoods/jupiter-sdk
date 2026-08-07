import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';

export const ACTIVATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([90, 186, 203, 234, 70, 185, 191, 21]);

export interface ActivateProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    locker: Address;
}

export interface ParsedActivateProposalInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        proposal: AccountMeta;
        locker: AccountMeta;
    };
    data: {};
}

export function parseActivateProposalInstruction(
    instruction: TransactionInstruction,
): ParsedActivateProposalInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for ActivateProposal instruction');
    }
    if (!ACTIVATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ActivateProposal instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            proposal: instruction.keys[1]!,
            locker: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createActivateProposalInstruction(
    accounts: ActivateProposalInstructionAccounts,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.locker, isSigner: true, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ACTIVATE_PROPOSAL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
