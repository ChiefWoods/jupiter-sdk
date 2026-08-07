import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';
import { findDepositorTokenAccountPda } from '../pdas/depositorTokenAccount';

export const REBALANCE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([108, 158, 77, 9, 210, 52, 88, 62]);

export interface RebalanceInstructionAccounts {
    signer: Address;
    depositorTokenAccount?: Address;
    lendingAdmin: Address;
    lending: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingSupplyPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    liquidity: Address;
    liquidityProgram: Address;
    rewardsRateModel: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface ParsedRebalanceInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        depositorTokenAccount: AccountMeta;
        lendingAdmin: AccountMeta;
        lending: AccountMeta;
        mint: AccountMeta;
        fTokenMint: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        lendingSupplyPositionOnLiquidity: AccountMeta;
        rateModel: AccountMeta;
        vault: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        rewardsRateModel: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseRebalanceInstruction(instruction: TransactionInstruction): ParsedRebalanceInstruction {
    if (instruction.keys.length < 16) {
        throw new Error('Expected 16 account metas for Rebalance instruction');
    }
    if (!REBALANCE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Rebalance instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            depositorTokenAccount: instruction.keys[1]!,
            lendingAdmin: instruction.keys[2]!,
            lending: instruction.keys[3]!,
            mint: instruction.keys[4]!,
            fTokenMint: instruction.keys[5]!,
            supplyTokenReservesLiquidity: instruction.keys[6]!,
            lendingSupplyPositionOnLiquidity: instruction.keys[7]!,
            rateModel: instruction.keys[8]!,
            vault: instruction.keys[9]!,
            liquidity: instruction.keys[10]!,
            liquidityProgram: instruction.keys[11]!,
            rewardsRateModel: instruction.keys[12]!,
            tokenProgram: instruction.keys[13]!,
            associatedTokenProgram: instruction.keys[14]!,
            systemProgram: instruction.keys[15]!,
        },
        data: {},
    };
}

export async function createRebalanceInstruction(
    accounts: RebalanceInstructionAccounts,
    programId: Address = LENDEARN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let depositorTokenAccount = accounts.depositorTokenAccount;
    if (!depositorTokenAccount) {
        const [derived] = await findDepositorTokenAccountPda({
            signer: accounts.signer,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
        depositorTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: depositorTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REBALANCE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
