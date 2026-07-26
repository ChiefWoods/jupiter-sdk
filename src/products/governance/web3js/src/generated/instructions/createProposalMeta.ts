import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { addCodecSizePrefix, getStructCodec, getU32Codec, getU8Codec, getUtf8Codec } from '@solana/codecs';

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

const CreateProposalMetaInstructionDataCodec = getStructCodec([
    ['bump', getU8Codec()],
    ['title', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['descriptionLink', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
]);

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
    const instructionData = Buffer.from(CreateProposalMetaInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('ee8ad4a02e353358', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
