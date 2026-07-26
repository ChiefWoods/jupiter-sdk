import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { findRateModelPda } from '../pdas/rateModel';
import { findTokenReservePda } from '../pdas/tokenReserve';
import { findVaultPda } from '../pdas/vault';

export interface InitTokenReserveInstructionAccounts {
    authority: Address;
    liquidity: Address;
    authList: Address;
    mint: Address;
    vault?: Address;
    rateModel?: Address;
    tokenReserve?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export async function createInitTokenReserveInstruction(
    accounts: InitTokenReserveInstructionAccounts,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                liquidity: accounts.liquidity,
                tokenProgram: accounts.tokenProgram,
                mint: accounts.mint,
            },
            programId,
        );
        vault = derived;
    }
    let rateModel = accounts.rateModel;
    if (!rateModel) {
        const [derived] = await findRateModelPda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        rateModel = derived;
    }
    let tokenReserve = accounts.tokenReserve;
    if (!tokenReserve) {
        const [derived] = await findTokenReservePda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        tokenReserve = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: vault, isSigner: false, isWritable: true },
        { pubkey: rateModel, isSigner: false, isWritable: true },
        { pubkey: tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('e4eb41819f0f0654', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
