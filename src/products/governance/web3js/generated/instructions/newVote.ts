import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface NewVoteInstructionAccounts {
    proposal: Address;
    vote: Address;
    payer: Address;
    systemProgram: Address;
}

export interface NewVoteInstructionArgs {
    voter: Address;
}

function getNewVoteInstructionDataEncoder(): Encoder<NewVoteInstructionArgs> {
    return getStructEncoder([
        ['voter', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createNewVoteInstruction(
    accounts: NewVoteInstructionAccounts,
    args: NewVoteInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.proposal, isSigner: false, isWritable: false },
        { pubkey: accounts.vote, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getNewVoteInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a36c9dbd8c500d8f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
