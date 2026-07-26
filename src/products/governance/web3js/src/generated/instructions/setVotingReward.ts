import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface SetVotingRewardInstructionAccounts {
    governor: Address;
    rewardMint: Address;
    smartWallet: Address;
}

export interface SetVotingRewardInstructionArgs {
    rewardPerProposal: bigint;
}

const SetVotingRewardInstructionDataCodec = getStructCodec([['rewardPerProposal', getU64Codec()]]);

export function createSetVotingRewardInstruction(
    accounts: SetVotingRewardInstructionAccounts,
    args: SetVotingRewardInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    const instructionData = Buffer.from(SetVotingRewardInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('e3f130891e1a6846', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
