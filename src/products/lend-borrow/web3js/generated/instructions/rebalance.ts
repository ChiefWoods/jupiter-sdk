import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';

export const REBALANCE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([108, 158, 77, 9, 210, 52, 88, 62]);

export interface RebalanceInstructionAccounts {
    rebalancer: Address;
    rebalancerSupplyTokenAccount: Address;
    rebalancerBorrowTokenAccount: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken: Address;
    borrowToken: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
    vaultSupplyPositionOnLiquidity: Address;
    vaultBorrowPositionOnLiquidity: Address;
    supplyRateModel: Address;
    borrowRateModel: Address;
    liquidity: Address;
    liquidityProgram: Address;
    vaultSupplyTokenAccount: Address;
    vaultBorrowTokenAccount: Address;
    systemProgram: Address;
    supplyTokenProgram: Address;
    borrowTokenProgram: Address;
    associatedTokenProgram?: Address;
}

export interface ParsedRebalanceInstruction {
    programId: Address;
    accounts: {
        rebalancer: AccountMeta;
        rebalancerSupplyTokenAccount: AccountMeta;
        rebalancerBorrowTokenAccount: AccountMeta;
        vaultConfig: AccountMeta;
        vaultState: AccountMeta;
        supplyToken: AccountMeta;
        borrowToken: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
        vaultSupplyPositionOnLiquidity: AccountMeta;
        vaultBorrowPositionOnLiquidity: AccountMeta;
        supplyRateModel: AccountMeta;
        borrowRateModel: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        vaultSupplyTokenAccount: AccountMeta;
        vaultBorrowTokenAccount: AccountMeta;
        systemProgram: AccountMeta;
        supplyTokenProgram: AccountMeta;
        borrowTokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
    };
    data: {};
}

export function parseRebalanceInstruction(instruction: TransactionInstruction): ParsedRebalanceInstruction {
    if (instruction.keys.length < 21) {
        throw new Error('Expected 21 account metas for Rebalance instruction');
    }
    if (!REBALANCE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Rebalance instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            rebalancer: instruction.keys[0]!,
            rebalancerSupplyTokenAccount: instruction.keys[1]!,
            rebalancerBorrowTokenAccount: instruction.keys[2]!,
            vaultConfig: instruction.keys[3]!,
            vaultState: instruction.keys[4]!,
            supplyToken: instruction.keys[5]!,
            borrowToken: instruction.keys[6]!,
            supplyTokenReservesLiquidity: instruction.keys[7]!,
            borrowTokenReservesLiquidity: instruction.keys[8]!,
            vaultSupplyPositionOnLiquidity: instruction.keys[9]!,
            vaultBorrowPositionOnLiquidity: instruction.keys[10]!,
            supplyRateModel: instruction.keys[11]!,
            borrowRateModel: instruction.keys[12]!,
            liquidity: instruction.keys[13]!,
            liquidityProgram: instruction.keys[14]!,
            vaultSupplyTokenAccount: instruction.keys[15]!,
            vaultBorrowTokenAccount: instruction.keys[16]!,
            systemProgram: instruction.keys[17]!,
            supplyTokenProgram: instruction.keys[18]!,
            borrowTokenProgram: instruction.keys[19]!,
            associatedTokenProgram: instruction.keys[20]!,
        },
        data: {},
    };
}

export function createRebalanceInstruction(
    accounts: RebalanceInstructionAccounts,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.rebalancer, isSigner: true, isWritable: true },
        { pubkey: accounts.rebalancerSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.rebalancerBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyToken, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowToken, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
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
