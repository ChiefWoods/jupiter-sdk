import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface QueueNextRewardsInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export interface QueueNextRewardsInstructionArgs {
    rewardAmount: number | bigint;
    duration: number | bigint;
}

function getQueueNextRewardsInstructionDataEncoder(): Encoder<QueueNextRewardsInstructionArgs> {
    return getStructEncoder([
        ['rewardAmount', getU64Encoder()],
        ['duration', getU64Encoder()],
    ]);
}

export function createQueueNextRewardsInstruction(
    accounts: QueueNextRewardsInstructionAccounts,
    args: QueueNextRewardsInstructionArgs,
    programId: Address = LENDINGREWARDRATEMODEL_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingRewardsRateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getQueueNextRewardsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('0c26f850804c9bd2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
