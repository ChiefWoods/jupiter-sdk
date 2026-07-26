import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec, getU8Codec } from '@solana/codecs';

export interface SetVoteInstructionAccounts {
    governor: Address;
    proposal: Address;
    vote: Address;
    locker: Address;
}

export interface SetVoteInstructionArgs {
    side: number;
    weight: bigint;
}

const SetVoteInstructionDataCodec = getStructCodec([
    ['side', getU8Codec()],
    ['weight', getU64Codec()],
]);

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
    const instructionData = Buffer.from(SetVoteInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('ab2153ac94d7ef61', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
