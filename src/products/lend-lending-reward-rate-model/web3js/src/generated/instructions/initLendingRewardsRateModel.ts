import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';
import { findLendingRewardsRateModelPda } from '../pdas/lendingRewardsRateModel';

export interface InitLendingRewardsRateModelInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
    mint: Address;
    lendingRewardsRateModel?: Address;
    systemProgram: Address;
}

export async function createInitLendingRewardsRateModelInstruction(
    accounts: InitLendingRewardsRateModelInstructionAccounts,
    programId: Address = LENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lendingRewardsRateModel = accounts.lendingRewardsRateModel;
    if (!lendingRewardsRateModel) {
        const [derived] = await findLendingRewardsRateModelPda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        lendingRewardsRateModel = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: lendingRewardsRateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('757bc434f65aa800', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
