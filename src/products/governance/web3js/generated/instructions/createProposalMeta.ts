import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getStructEncoder,
    getU32Encoder,
    getU8Encoder,
    getUtf8Encoder,
    type Encoder,
} from '@solana/codecs';

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

export function createCreateProposalMetaInstruction(
    accounts: CreateProposalMetaInstructionAccounts,
    args: CreateProposalMetaInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
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
    const instructionData = Buffer.from(getCreateProposalMetaInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('ee8ad4a02e353358', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
