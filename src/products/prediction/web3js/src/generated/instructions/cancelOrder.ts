import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { findOrderAtaPda } from '../pdas/orderAta';
import { findVaultPda } from '../pdas/vault';

export interface CancelOrderInstructionAccounts {
    owner: Address;
    authority: Address;
    vault?: Address;
    order: Address;
    rentDestination: Address;
    position: Address;
    orderAta?: Address;
    ownerTokenAccount: Address;
    settlementMint: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
}

export async function createCancelOrderInstruction(
    accounts: CancelOrderInstructionAccounts,
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
    let orderAta = accounts.orderAta;
    if (!orderAta) {
        const [derived] = await findOrderAtaPda(
            {
                order: accounts.order,
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        orderAta = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: vault, isSigner: false, isWritable: false },
        { pubkey: accounts.order, isSigner: false, isWritable: true },
        { pubkey: accounts.rentDestination, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: orderAta, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.settlementMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('5f81edf00831df84', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
