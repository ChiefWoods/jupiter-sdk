import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findRebalancerBorrowTokenAccountPda } from '../pdas/rebalancerBorrowTokenAccount';
import { findRebalancerSupplyTokenAccountPda } from '../pdas/rebalancerSupplyTokenAccount';
import {
    getI128Decoder,
    getI128Encoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const REBALANCE_DEX_INSTRUCTION_DISCRIMINATOR = new Uint8Array([71, 178, 19, 146, 254, 47, 109, 126]);

export interface RebalanceDexInstructionAccounts {
    rebalancer: Address;
    rebalancerSupplyTokenAccount?: Address;
    rebalancerBorrowTokenAccount?: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken: Address;
    borrowToken: Address;
    supplyTokenReservesLiquidity?: Address;
    borrowTokenReservesLiquidity?: Address;
    vaultSupplyPositionOnLiquidity?: Address;
    vaultBorrowPositionOnLiquidity?: Address;
    supplyRateModel?: Address;
    borrowRateModel?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    vaultSupplyTokenAccount?: Address;
    vaultBorrowTokenAccount?: Address;
    systemProgram: Address;
    supplyTokenProgram: Address;
    borrowTokenProgram: Address;
    associatedTokenProgram?: Address;
    dexProgram: Address;
    dexOracleProgram?: Address;
    supplyDexDex?: Address;
    supplyDexDexPosition?: Address;
    supplyDexDexUserToken0Account?: Address;
    supplyDexDexUserToken1Account?: Address;
    supplyDexDexToken0?: Address;
    supplyDexDexToken1?: Address;
    supplyDexDexToken0Reserve?: Address;
    supplyDexDexToken1Reserve?: Address;
    supplyDexDexToken0RateModel?: Address;
    supplyDexDexToken1RateModel?: Address;
    supplyDexDexToken0Vault?: Address;
    supplyDexDexToken1Vault?: Address;
    supplyDexSupplyPosToken0?: Address;
    supplyDexSupplyPosToken1?: Address;
    supplyDexBorrowPosToken0?: Address;
    supplyDexBorrowPosToken1?: Address;
    supplyDexDexToken0Program?: Address;
    supplyDexDexToken1Program?: Address;
    supplyDexDexRecipientToken0Account?: Address;
    supplyDexDexRecipientToken1Account?: Address;
    borrowDexDex?: Address;
    borrowDexDexPosition?: Address;
    borrowDexDexUserToken0Account?: Address;
    borrowDexDexUserToken1Account?: Address;
    borrowDexDexToken0?: Address;
    borrowDexDexToken1?: Address;
    borrowDexDexToken0Reserve?: Address;
    borrowDexDexToken1Reserve?: Address;
    borrowDexDexToken0RateModel?: Address;
    borrowDexDexToken1RateModel?: Address;
    borrowDexDexToken0Vault?: Address;
    borrowDexDexToken1Vault?: Address;
    borrowDexSupplyPosToken0?: Address;
    borrowDexSupplyPosToken1?: Address;
    borrowDexBorrowPosToken0?: Address;
    borrowDexBorrowPosToken1?: Address;
    borrowDexDexToken0Program?: Address;
    borrowDexDexToken1Program?: Address;
    borrowDexDexRecipientToken0Account?: Address;
    borrowDexDexRecipientToken1Account?: Address;
}

export interface RebalanceDexInstructionArgs {
    colToken0MinMax: number | bigint;
    colToken1MinMax: number | bigint;
    debtToken0MinMax: number | bigint;
    debtToken1MinMax: number | bigint;
}

function getRebalanceDexInstructionDataEncoder(): Encoder<RebalanceDexInstructionArgs> {
    return getStructEncoder([
        ['colToken0MinMax', getI128Encoder()],
        ['colToken1MinMax', getI128Encoder()],
        ['debtToken0MinMax', getI128Encoder()],
        ['debtToken1MinMax', getI128Encoder()],
    ]);
}

function getRebalanceDexInstructionDataDecoder(): Decoder<RebalanceDexInstructionArgs> {
    return getStructDecoder([
        ['colToken0MinMax', getI128Decoder()],
        ['colToken1MinMax', getI128Decoder()],
        ['debtToken0MinMax', getI128Decoder()],
        ['debtToken1MinMax', getI128Decoder()],
    ]);
}

export interface ParsedRebalanceDexInstruction {
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
        dexProgram: AccountMeta;
        dexOracleProgram: AccountMeta;
        supplyDexDex: AccountMeta;
        supplyDexDexPosition: AccountMeta;
        supplyDexDexUserToken0Account: AccountMeta;
        supplyDexDexUserToken1Account: AccountMeta;
        supplyDexDexToken0: AccountMeta;
        supplyDexDexToken1: AccountMeta;
        supplyDexDexToken0Reserve: AccountMeta;
        supplyDexDexToken1Reserve: AccountMeta;
        supplyDexDexToken0RateModel: AccountMeta;
        supplyDexDexToken1RateModel: AccountMeta;
        supplyDexDexToken0Vault: AccountMeta;
        supplyDexDexToken1Vault: AccountMeta;
        supplyDexSupplyPosToken0: AccountMeta;
        supplyDexSupplyPosToken1: AccountMeta;
        supplyDexBorrowPosToken0: AccountMeta;
        supplyDexBorrowPosToken1: AccountMeta;
        supplyDexDexToken0Program: AccountMeta;
        supplyDexDexToken1Program: AccountMeta;
        supplyDexDexRecipientToken0Account: AccountMeta;
        supplyDexDexRecipientToken1Account: AccountMeta;
        borrowDexDex: AccountMeta;
        borrowDexDexPosition: AccountMeta;
        borrowDexDexUserToken0Account: AccountMeta;
        borrowDexDexUserToken1Account: AccountMeta;
        borrowDexDexToken0: AccountMeta;
        borrowDexDexToken1: AccountMeta;
        borrowDexDexToken0Reserve: AccountMeta;
        borrowDexDexToken1Reserve: AccountMeta;
        borrowDexDexToken0RateModel: AccountMeta;
        borrowDexDexToken1RateModel: AccountMeta;
        borrowDexDexToken0Vault: AccountMeta;
        borrowDexDexToken1Vault: AccountMeta;
        borrowDexSupplyPosToken0: AccountMeta;
        borrowDexSupplyPosToken1: AccountMeta;
        borrowDexBorrowPosToken0: AccountMeta;
        borrowDexBorrowPosToken1: AccountMeta;
        borrowDexDexToken0Program: AccountMeta;
        borrowDexDexToken1Program: AccountMeta;
        borrowDexDexRecipientToken0Account: AccountMeta;
        borrowDexDexRecipientToken1Account: AccountMeta;
    };
    data: RebalanceDexInstructionArgs;
}

export function parseRebalanceDexInstruction(instruction: TransactionInstruction): ParsedRebalanceDexInstruction {
    if (instruction.keys.length < 63) {
        throw new Error('Expected 63 account metas for RebalanceDex instruction');
    }
    if (!REBALANCE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RebalanceDex instruction discriminator mismatch');
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
            dexProgram: instruction.keys[21]!,
            dexOracleProgram: instruction.keys[22]!,
            supplyDexDex: instruction.keys[23]!,
            supplyDexDexPosition: instruction.keys[24]!,
            supplyDexDexUserToken0Account: instruction.keys[25]!,
            supplyDexDexUserToken1Account: instruction.keys[26]!,
            supplyDexDexToken0: instruction.keys[27]!,
            supplyDexDexToken1: instruction.keys[28]!,
            supplyDexDexToken0Reserve: instruction.keys[29]!,
            supplyDexDexToken1Reserve: instruction.keys[30]!,
            supplyDexDexToken0RateModel: instruction.keys[31]!,
            supplyDexDexToken1RateModel: instruction.keys[32]!,
            supplyDexDexToken0Vault: instruction.keys[33]!,
            supplyDexDexToken1Vault: instruction.keys[34]!,
            supplyDexSupplyPosToken0: instruction.keys[35]!,
            supplyDexSupplyPosToken1: instruction.keys[36]!,
            supplyDexBorrowPosToken0: instruction.keys[37]!,
            supplyDexBorrowPosToken1: instruction.keys[38]!,
            supplyDexDexToken0Program: instruction.keys[39]!,
            supplyDexDexToken1Program: instruction.keys[40]!,
            supplyDexDexRecipientToken0Account: instruction.keys[41]!,
            supplyDexDexRecipientToken1Account: instruction.keys[42]!,
            borrowDexDex: instruction.keys[43]!,
            borrowDexDexPosition: instruction.keys[44]!,
            borrowDexDexUserToken0Account: instruction.keys[45]!,
            borrowDexDexUserToken1Account: instruction.keys[46]!,
            borrowDexDexToken0: instruction.keys[47]!,
            borrowDexDexToken1: instruction.keys[48]!,
            borrowDexDexToken0Reserve: instruction.keys[49]!,
            borrowDexDexToken1Reserve: instruction.keys[50]!,
            borrowDexDexToken0RateModel: instruction.keys[51]!,
            borrowDexDexToken1RateModel: instruction.keys[52]!,
            borrowDexDexToken0Vault: instruction.keys[53]!,
            borrowDexDexToken1Vault: instruction.keys[54]!,
            borrowDexSupplyPosToken0: instruction.keys[55]!,
            borrowDexSupplyPosToken1: instruction.keys[56]!,
            borrowDexBorrowPosToken0: instruction.keys[57]!,
            borrowDexBorrowPosToken1: instruction.keys[58]!,
            borrowDexDexToken0Program: instruction.keys[59]!,
            borrowDexDexToken1Program: instruction.keys[60]!,
            borrowDexDexRecipientToken0Account: instruction.keys[61]!,
            borrowDexDexRecipientToken1Account: instruction.keys[62]!,
        },
        data: getRebalanceDexInstructionDataDecoder().decode(instructionData),
    };
}

export async function createRebalanceDexInstruction(
    accounts: RebalanceDexInstructionAccounts,
    args: RebalanceDexInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let rebalancerSupplyTokenAccount = accounts.rebalancerSupplyTokenAccount;
    if (!rebalancerSupplyTokenAccount) {
        const [derived] = await findRebalancerSupplyTokenAccountPda({
            rebalancer: accounts.rebalancer,
            supplyTokenProgram: accounts.supplyTokenProgram,
            supplyToken: accounts.supplyToken,
        });
        rebalancerSupplyTokenAccount = derived;
    }
    let rebalancerBorrowTokenAccount = accounts.rebalancerBorrowTokenAccount;
    if (!rebalancerBorrowTokenAccount) {
        const [derived] = await findRebalancerBorrowTokenAccountPda({
            rebalancer: accounts.rebalancer,
            borrowTokenProgram: accounts.borrowTokenProgram,
            borrowToken: accounts.borrowToken,
        });
        rebalancerBorrowTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.rebalancer, isSigner: true, isWritable: true },
        { pubkey: rebalancerSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: rebalancerBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyToken, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowToken, isSigner: false, isWritable: false },
        accounts.supplyTokenReservesLiquidity
            ? { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowTokenReservesLiquidity
            ? { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.vaultSupplyPositionOnLiquidity
            ? { pubkey: accounts.vaultSupplyPositionOnLiquidity, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.vaultBorrowPositionOnLiquidity
            ? { pubkey: accounts.vaultBorrowPositionOnLiquidity, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyRateModel
            ? { pubkey: accounts.supplyRateModel, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowRateModel
            ? { pubkey: accounts.borrowRateModel, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        accounts.vaultSupplyTokenAccount
            ? { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.vaultBorrowTokenAccount
            ? { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.dexProgram, isSigner: false, isWritable: false },
        accounts.dexOracleProgram
            ? { pubkey: accounts.dexOracleProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDex
            ? { pubkey: accounts.supplyDexDex, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexPosition
            ? { pubkey: accounts.supplyDexDexPosition, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexUserToken0Account
            ? { pubkey: accounts.supplyDexDexUserToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexUserToken1Account
            ? { pubkey: accounts.supplyDexDexUserToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken0
            ? { pubkey: accounts.supplyDexDexToken0, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken1
            ? { pubkey: accounts.supplyDexDexToken1, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken0Reserve
            ? { pubkey: accounts.supplyDexDexToken0Reserve, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken1Reserve
            ? { pubkey: accounts.supplyDexDexToken1Reserve, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken0RateModel
            ? { pubkey: accounts.supplyDexDexToken0RateModel, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken1RateModel
            ? { pubkey: accounts.supplyDexDexToken1RateModel, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken0Vault
            ? { pubkey: accounts.supplyDexDexToken0Vault, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken1Vault
            ? { pubkey: accounts.supplyDexDexToken1Vault, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexSupplyPosToken0
            ? { pubkey: accounts.supplyDexSupplyPosToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexSupplyPosToken1
            ? { pubkey: accounts.supplyDexSupplyPosToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexBorrowPosToken0
            ? { pubkey: accounts.supplyDexBorrowPosToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexBorrowPosToken1
            ? { pubkey: accounts.supplyDexBorrowPosToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken0Program
            ? { pubkey: accounts.supplyDexDexToken0Program, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexToken1Program
            ? { pubkey: accounts.supplyDexDexToken1Program, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexRecipientToken0Account
            ? { pubkey: accounts.supplyDexDexRecipientToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDexDexRecipientToken1Account
            ? { pubkey: accounts.supplyDexDexRecipientToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDex
            ? { pubkey: accounts.borrowDexDex, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexPosition
            ? { pubkey: accounts.borrowDexDexPosition, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexUserToken0Account
            ? { pubkey: accounts.borrowDexDexUserToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexUserToken1Account
            ? { pubkey: accounts.borrowDexDexUserToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken0
            ? { pubkey: accounts.borrowDexDexToken0, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken1
            ? { pubkey: accounts.borrowDexDexToken1, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken0Reserve
            ? { pubkey: accounts.borrowDexDexToken0Reserve, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken1Reserve
            ? { pubkey: accounts.borrowDexDexToken1Reserve, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken0RateModel
            ? { pubkey: accounts.borrowDexDexToken0RateModel, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken1RateModel
            ? { pubkey: accounts.borrowDexDexToken1RateModel, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken0Vault
            ? { pubkey: accounts.borrowDexDexToken0Vault, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken1Vault
            ? { pubkey: accounts.borrowDexDexToken1Vault, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexSupplyPosToken0
            ? { pubkey: accounts.borrowDexSupplyPosToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexSupplyPosToken1
            ? { pubkey: accounts.borrowDexSupplyPosToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexBorrowPosToken0
            ? { pubkey: accounts.borrowDexBorrowPosToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexBorrowPosToken1
            ? { pubkey: accounts.borrowDexBorrowPosToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken0Program
            ? { pubkey: accounts.borrowDexDexToken0Program, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexToken1Program
            ? { pubkey: accounts.borrowDexDexToken1Program, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexRecipientToken0Account
            ? { pubkey: accounts.borrowDexDexRecipientToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDexDexRecipientToken1Account
            ? { pubkey: accounts.borrowDexDexRecipientToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRebalanceDexInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REBALANCE_DEX_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
