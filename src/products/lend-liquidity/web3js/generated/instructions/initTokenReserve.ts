import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { findRateModelPda } from '../pdas/rateModel';
import { findTokenReservePda } from '../pdas/tokenReserve';
import { findVaultPda } from '../pdas/vault';

export const INIT_TOKEN_RESERVE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([228, 235, 65, 129, 159, 15, 6, 84]);

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

export interface ParsedInitTokenReserveInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        liquidity: AccountMeta;
        authList: AccountMeta;
        mint: AccountMeta;
        vault: AccountMeta;
        rateModel: AccountMeta;
        tokenReserve: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseInitTokenReserveInstruction(
    instruction: TransactionInstruction,
): ParsedInitTokenReserveInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for InitTokenReserve instruction');
    }
    if (!INIT_TOKEN_RESERVE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitTokenReserve instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            authList: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            vault: instruction.keys[4]!,
            rateModel: instruction.keys[5]!,
            tokenReserve: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
            associatedTokenProgram: instruction.keys[8]!,
            systemProgram: instruction.keys[9]!,
        },
        data: {},
    };
}

export async function createInitTokenReserveInstruction(
    accounts: InitTokenReserveInstructionAccounts,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda({
            liquidity: accounts.liquidity,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
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
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_TOKEN_RESERVE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
