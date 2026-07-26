import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface StartRewardsInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export interface StartRewardsInstructionArgs {
    rewardAmount: bigint;
    duration: bigint;
    startTime: bigint;
    startTvl: bigint;
}

const StartRewardsInstructionDataCodec = getStructCodec([
    ['rewardAmount', getU64Codec()],
    ['duration', getU64Codec()],
    ['startTime', getU64Codec()],
    ['startTvl', getU64Codec()],
]);

export function createStartRewardsInstruction(
    accounts: StartRewardsInstructionAccounts,
    args: StartRewardsInstructionArgs,
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
    const instructionData = Buffer.from(StartRewardsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('3eb76c0ea1917973', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
