import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import { findVaultPda } from '../pdas/vault';
import { findVaultTokenAccountPda } from '../pdas/vaultTokenAccount';

export const INITIALIZE_VAULT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([48, 191, 163, 44, 71, 129, 63, 164]);

export interface InitializeVaultInstructionAccounts {
    admin: Address;
    vault?: Address;
    settlementMint: Address;
    vaultTokenAccount?: Address;
    systemProgram: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
}

export interface ParsedInitializeVaultInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        vault: AccountMeta;
        settlementMint: AccountMeta;
        vaultTokenAccount: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
    };
    data: {};
}

export function parseInitializeVaultInstruction(instruction: TransactionInstruction): ParsedInitializeVaultInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for InitializeVault instruction');
    }
    if (!INITIALIZE_VAULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitializeVault instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            vault: instruction.keys[1]!,
            settlementMint: instruction.keys[2]!,
            vaultTokenAccount: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
            tokenProgram: instruction.keys[5]!,
            associatedTokenProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export async function createInitializeVaultInstruction(
    accounts: InitializeVaultInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
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
        const [derived] = await findVaultTokenAccountPda({
            vault: accounts.vault,
            settlementMint: accounts.settlementMint,
        });
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
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INITIALIZE_VAULT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
