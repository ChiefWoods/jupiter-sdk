import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { findRevenueCollectorAccountPda } from '../pdas/revenueCollectorAccount';
import { findVaultPda } from '../pdas/vault';

export const COLLECT_REVENUE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([87, 96, 211, 36, 240, 43, 246, 87]);

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

export interface ParsedCollectRevenueInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        liquidity: AccountMeta;
        authList: AccountMeta;
        mint: AccountMeta;
        revenueCollectorAccount: AccountMeta;
        revenueCollector: AccountMeta;
        tokenReserve: AccountMeta;
        vault: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseCollectRevenueInstruction(instruction: TransactionInstruction): ParsedCollectRevenueInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for CollectRevenue instruction');
    }
    if (!COLLECT_REVENUE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CollectRevenue instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            authList: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            revenueCollectorAccount: instruction.keys[4]!,
            revenueCollector: instruction.keys[5]!,
            tokenReserve: instruction.keys[6]!,
            vault: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            associatedTokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
        },
        data: {},
    };
}

export async function createCollectRevenueInstruction(
    accounts: CollectRevenueInstructionAccounts,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let revenueCollectorAccount = accounts.revenueCollectorAccount;
    if (!revenueCollectorAccount) {
        const [derived] = await findRevenueCollectorAccountPda({
            revenueCollector: accounts.revenueCollector,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
        revenueCollectorAccount = derived;
    }
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda({
            liquidity: accounts.liquidity,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
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
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(COLLECT_REVENUE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
