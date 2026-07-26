import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { findRevenueCollectorAccountPda } from '../pdas/revenueCollectorAccount';
import { findVaultPda } from '../pdas/vault';

export interface CollectRevenueInstructionAccounts {
    authority: Address;
    liquidity: Address;
    authList: Address;
    mint: Address;
    revenueCollectorAccount?: Address;
    revenueCollector: Address;
    tokenReserve: Address;
    vault?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export async function createCollectRevenueInstruction(
    accounts: CollectRevenueInstructionAccounts,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let revenueCollectorAccount = accounts.revenueCollectorAccount;
    if (!revenueCollectorAccount) {
        const [derived] = await findRevenueCollectorAccountPda(
            {
                revenueCollector: accounts.revenueCollector,
                tokenProgram: accounts.tokenProgram,
                mint: accounts.mint,
            },
            programId,
        );
        revenueCollectorAccount = derived;
    }
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
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: revenueCollectorAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.revenueCollector, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('5760d324f02bf657', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
