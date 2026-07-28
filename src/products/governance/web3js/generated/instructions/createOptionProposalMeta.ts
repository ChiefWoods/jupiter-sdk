import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getArrayEncoder,
    getStructEncoder,
    getU32Encoder,
    getU8Encoder,
    getUtf8Encoder,
    type Encoder,
} from '@solana/codecs';

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

export function createCreateOptionProposalMetaInstruction(
    accounts: CreateOptionProposalMetaInstructionAccounts,
    args: CreateOptionProposalMetaInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
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
    const instructionData = Buffer.from(getCreateOptionProposalMetaInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('989068e4f5eaa4e0', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
