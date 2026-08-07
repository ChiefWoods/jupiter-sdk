import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { findTokenAccountPda } from '../pdas/tokenAccount';
import { findVaultPda } from '../pdas/vault';

export const CREATE_VAULT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([29, 237, 247, 208, 193, 82, 54, 135]);

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

export interface ParsedCreateVaultInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        payer: AccountMeta;
        mint: AccountMeta;
        config: AccountMeta;
        authority: AccountMeta;
        vault: AccountMeta;
        tokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseCreateVaultInstruction(instruction: TransactionInstruction): ParsedCreateVaultInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for CreateVault instruction');
    }
    if (!CREATE_VAULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateVault instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            payer: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            config: instruction.keys[4]!,
            authority: instruction.keys[5]!,
            vault: instruction.keys[6]!,
            tokenAccount: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            associatedTokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
        },
        data: {},
    };
}

export async function createCreateVaultInstruction(
    accounts: CreateVaultInstructionAccounts,
    programId: Address = STABLECOIN_PROGRAM_ID,
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
        const [derived] = await findTokenAccountPda({
            authority: accounts.authority,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
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
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_VAULT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
