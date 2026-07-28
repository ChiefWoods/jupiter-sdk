import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, getU8Encoder, type Encoder } from '@solana/codecs';

export interface SetVoteInstructionAccounts {
    governor: Address;
    proposal: Address;
    vote: Address;
    locker: Address;
}

export interface SetVoteInstructionArgs {
    side: number;
    weight: number | bigint;
}

function getSetVoteInstructionDataEncoder(): Encoder<SetVoteInstructionArgs> {
    return getStructEncoder([
        ['side', getU8Encoder()],
        ['weight', getU64Encoder()],
    ]);
}

export function createSetVoteInstruction(
    accounts: SetVoteInstructionAccounts,
    args: SetVoteInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: false },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.vote, isSigner: false, isWritable: true },
        { pubkey: accounts.locker, isSigner: true, isWritable: false },
    ];
    const instructionData = Buffer.from(getSetVoteInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('ab2153ac94d7ef61', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
