import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';

export const QUEUE_PROPOSAL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([168, 219, 139, 211, 205, 152, 125, 110]);

export interface QueueProposalInstructionAccounts {
    governor: Address;
    proposal: Address;
    transaction: Address;
    smartWallet: Address;
    payer: Address;
    smartWalletProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedQueueProposalInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        proposal: AccountMeta;
        transaction: AccountMeta;
        smartWallet: AccountMeta;
        payer: AccountMeta;
        smartWalletProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseQueueProposalInstruction(instruction: TransactionInstruction): ParsedQueueProposalInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for QueueProposal instruction');
    }
    if (!QUEUE_PROPOSAL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('QueueProposal instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            proposal: instruction.keys[1]!,
            transaction: instruction.keys[2]!,
            smartWallet: instruction.keys[3]!,
            payer: instruction.keys[4]!,
            smartWalletProgram: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
            eventAuthority: instruction.keys[7]!,
            program: instruction.keys[8]!,
        },
        data: {},
    };
}

export function createQueueProposalInstruction(
    accounts: QueueProposalInstructionAccounts,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.transaction, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.smartWalletProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(QUEUE_PROPOSAL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
