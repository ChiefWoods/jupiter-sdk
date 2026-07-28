import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { findVaultPda } from '../pdas/vault';
import { findVaultTokenAccountPda } from '../pdas/vaultTokenAccount';

export interface InitializeVaultInstructionAccounts {
    admin: Address;
    vault?: Address;
    settlementMint: Address;
    vaultTokenAccount?: Address;
    systemProgram: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
}

export async function createInitializeVaultInstruction(
    accounts: InitializeVaultInstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        vault = derived;
    }
    let vaultTokenAccount = accounts.vaultTokenAccount;
    if (!vaultTokenAccount) {
        const [derived] = await findVaultTokenAccountPda(
            {
                vault: accounts.vault,
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        vaultTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: true },
        { pubkey: accounts.settlementMint, isSigner: false, isWritable: false },
        { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('30bfa32c47813fa4', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
