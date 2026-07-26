import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';

export interface TransitionToNextRewardsInstructionAccounts {
    lendingRewardsAdmin: Address;
    lendingAccount: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingRewardsRateModel: Address;
    lendingProgram: Address;
}

export function createTransitionToNextRewardsInstruction(
    accounts: TransitionToNextRewardsInstructionAccounts,
    programId: Address = LENDINGREWARDRATEMODEL_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingRewardsRateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('a732e95d00b29af7', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
