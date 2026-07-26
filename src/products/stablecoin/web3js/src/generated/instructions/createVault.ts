import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { findTokenAccountPda } from '../pdas/tokenAccount';
import { findVaultPda } from '../pdas/vault';

export interface CreateVaultInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    payer: Address;
    mint: Address;
    config: Address;
    authority: Address;
    vault?: Address;
    tokenAccount?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export async function createCreateVaultInstruction(
    accounts: CreateVaultInstructionAccounts,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        vault = derived;
    }
    let tokenAccount = accounts.tokenAccount;
    if (!tokenAccount) {
        const [derived] = await findTokenAccountPda(
            {
                authority: accounts.authority,
                tokenProgram: accounts.tokenProgram,
                mint: accounts.mint,
            },
            programId,
        );
        tokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: vault, isSigner: false, isWritable: true },
        { pubkey: tokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('1dedf7d0c1523687', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
