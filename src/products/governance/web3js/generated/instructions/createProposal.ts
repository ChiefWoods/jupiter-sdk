import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { getArrayEncoder, getStructEncoder, getU8Encoder, type Encoder } from '@solana/codecs';
import { getProposalInstructionEncoder, type ProposalInstructionArgs } from '../types/proposalInstruction';

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

export function createCreateProposalInstruction(
    accounts: CreateProposalInstructionAccounts,
    args: CreateProposalInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
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
    const instructionData = Buffer.from(getCreateProposalInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('847444aed8a0c616', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
