import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getLiquidateDexColAmountsDecoder,
    getLiquidateDexColAmountsEncoder,
    type LiquidateDexColAmountsArgs,
} from '../types/liquidateDexColAmounts';
import {
    getLiquidatePerfectDexDebtAmountsDecoder,
    getLiquidatePerfectDexDebtAmountsEncoder,
    type LiquidatePerfectDexDebtAmountsArgs,
} from '../types/liquidatePerfectDexDebtAmounts';
import { getTransferTypeDecoder, getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

export const LIQUIDATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR = new Uint8Array([26, 113, 116, 50, 247, 131, 208, 5]);

export interface LiquidatePerfectDexInstructionAccounts {
    signer: Address;
    signerTokenAccount?: Address;
    to: Address;
    toTokenAccount?: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken?: Address;
    borrowToken?: Address;
    oracle: Address;
    newBranch: Address;
    supplyTokenReservesLiquidity?: Address;
    borrowTokenReservesLiquidity?: Address;
    vaultSupplyPositionOnLiquidity?: Address;
    vaultBorrowPositionOnLiquidity?: Address;
    supplyRateModel?: Address;
    borrowRateModel?: Address;
    supplyTokenClaimAccount?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    vaultSupplyTokenAccount?: Address;
    vaultBorrowTokenAccount?: Address;
    supplyTokenProgram?: Address;
    borrowTokenProgram?: Address;
    systemProgram: Address;
    oracleProgram: Address;
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
    dexProgram: Address;
    dexOracleProgram?: Address;
}

export interface LiquidatePerfectDexInstructionArgs {
    debtAmt: number | bigint;
    debtPerfectAmounts: OptionOrNullable<LiquidatePerfectDexDebtAmountsArgs>;
    colPerUnitDebt: number | bigint;
    colAmounts: OptionOrNullable<LiquidateDexColAmountsArgs>;
    absorb: boolean;
    transferType: OptionOrNullable<TransferTypeArgs>;
    remainingAccountsIndices: ReadonlyUint8Array;
}

function getLiquidatePerfectDexInstructionDataEncoder(): Encoder<LiquidatePerfectDexInstructionArgs> {
    return getStructEncoder([
        ['debtAmt', getU64Encoder()],
        ['debtPerfectAmounts', getOptionEncoder(getLiquidatePerfectDexDebtAmountsEncoder())],
        ['colPerUnitDebt', getU128Encoder()],
        ['colAmounts', getOptionEncoder(getLiquidateDexColAmountsEncoder())],
        ['absorb', getBooleanEncoder()],
        ['transferType', getOptionEncoder(getTransferTypeEncoder())],
        ['remainingAccountsIndices', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

function getLiquidatePerfectDexInstructionDataDecoder(): Decoder<LiquidatePerfectDexInstructionArgs> {
    return getStructDecoder([
        ['debtAmt', getU64Decoder()],
        ['debtPerfectAmounts', getOptionDecoder(getLiquidatePerfectDexDebtAmountsDecoder())],
        ['colPerUnitDebt', getU128Decoder()],
        ['colAmounts', getOptionDecoder(getLiquidateDexColAmountsDecoder())],
        ['absorb', getBooleanDecoder()],
        ['transferType', getOptionDecoder(getTransferTypeDecoder())],
        ['remainingAccountsIndices', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ]);
}

export interface ParsedLiquidatePerfectDexInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerTokenAccount: AccountMeta;
        to: AccountMeta;
        toTokenAccount: AccountMeta;
        vaultConfig: AccountMeta;
        vaultState: AccountMeta;
        supplyToken: AccountMeta;
        borrowToken: AccountMeta;
        oracle: AccountMeta;
        newBranch: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
        vaultSupplyPositionOnLiquidity: AccountMeta;
        vaultBorrowPositionOnLiquidity: AccountMeta;
        supplyRateModel: AccountMeta;
        borrowRateModel: AccountMeta;
        supplyTokenClaimAccount: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        vaultSupplyTokenAccount: AccountMeta;
        vaultBorrowTokenAccount: AccountMeta;
        supplyTokenProgram: AccountMeta;
        borrowTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        oracleProgram: AccountMeta;
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
        dexProgram: AccountMeta;
        dexOracleProgram: AccountMeta;
    };
    data: LiquidatePerfectDexInstructionArgs;
}

export function parseLiquidatePerfectDexInstruction(
    instruction: TransactionInstruction,
): ParsedLiquidatePerfectDexInstruction {
    if (instruction.keys.length < 67) {
        throw new Error('Expected 67 account metas for LiquidatePerfectDex instruction');
    }
    if (!LIQUIDATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('LiquidatePerfectDex instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerTokenAccount: instruction.keys[1]!,
            to: instruction.keys[2]!,
            toTokenAccount: instruction.keys[3]!,
            vaultConfig: instruction.keys[4]!,
            vaultState: instruction.keys[5]!,
            supplyToken: instruction.keys[6]!,
            borrowToken: instruction.keys[7]!,
            oracle: instruction.keys[8]!,
            newBranch: instruction.keys[9]!,
            supplyTokenReservesLiquidity: instruction.keys[10]!,
            borrowTokenReservesLiquidity: instruction.keys[11]!,
            vaultSupplyPositionOnLiquidity: instruction.keys[12]!,
            vaultBorrowPositionOnLiquidity: instruction.keys[13]!,
            supplyRateModel: instruction.keys[14]!,
            borrowRateModel: instruction.keys[15]!,
            supplyTokenClaimAccount: instruction.keys[16]!,
            liquidity: instruction.keys[17]!,
            liquidityProgram: instruction.keys[18]!,
            vaultSupplyTokenAccount: instruction.keys[19]!,
            vaultBorrowTokenAccount: instruction.keys[20]!,
            supplyTokenProgram: instruction.keys[21]!,
            borrowTokenProgram: instruction.keys[22]!,
            systemProgram: instruction.keys[23]!,
            oracleProgram: instruction.keys[24]!,
            supplyDexDex: instruction.keys[25]!,
            supplyDexDexPosition: instruction.keys[26]!,
            supplyDexDexUserToken0Account: instruction.keys[27]!,
            supplyDexDexUserToken1Account: instruction.keys[28]!,
            supplyDexDexToken0: instruction.keys[29]!,
            supplyDexDexToken1: instruction.keys[30]!,
            supplyDexDexToken0Reserve: instruction.keys[31]!,
            supplyDexDexToken1Reserve: instruction.keys[32]!,
            supplyDexDexToken0RateModel: instruction.keys[33]!,
            supplyDexDexToken1RateModel: instruction.keys[34]!,
            supplyDexDexToken0Vault: instruction.keys[35]!,
            supplyDexDexToken1Vault: instruction.keys[36]!,
            supplyDexSupplyPosToken0: instruction.keys[37]!,
            supplyDexSupplyPosToken1: instruction.keys[38]!,
            supplyDexBorrowPosToken0: instruction.keys[39]!,
            supplyDexBorrowPosToken1: instruction.keys[40]!,
            supplyDexDexToken0Program: instruction.keys[41]!,
            supplyDexDexToken1Program: instruction.keys[42]!,
            supplyDexDexRecipientToken0Account: instruction.keys[43]!,
            supplyDexDexRecipientToken1Account: instruction.keys[44]!,
            borrowDexDex: instruction.keys[45]!,
            borrowDexDexPosition: instruction.keys[46]!,
            borrowDexDexUserToken0Account: instruction.keys[47]!,
            borrowDexDexUserToken1Account: instruction.keys[48]!,
            borrowDexDexToken0: instruction.keys[49]!,
            borrowDexDexToken1: instruction.keys[50]!,
            borrowDexDexToken0Reserve: instruction.keys[51]!,
            borrowDexDexToken1Reserve: instruction.keys[52]!,
            borrowDexDexToken0RateModel: instruction.keys[53]!,
            borrowDexDexToken1RateModel: instruction.keys[54]!,
            borrowDexDexToken0Vault: instruction.keys[55]!,
            borrowDexDexToken1Vault: instruction.keys[56]!,
            borrowDexSupplyPosToken0: instruction.keys[57]!,
            borrowDexSupplyPosToken1: instruction.keys[58]!,
            borrowDexBorrowPosToken0: instruction.keys[59]!,
            borrowDexBorrowPosToken1: instruction.keys[60]!,
            borrowDexDexToken0Program: instruction.keys[61]!,
            borrowDexDexToken1Program: instruction.keys[62]!,
            borrowDexDexRecipientToken0Account: instruction.keys[63]!,
            borrowDexDexRecipientToken1Account: instruction.keys[64]!,
            dexProgram: instruction.keys[65]!,
            dexOracleProgram: instruction.keys[66]!,
        },
        data: getLiquidatePerfectDexInstructionDataDecoder().decode(instructionData),
    };
}

export function createLiquidatePerfectDexInstruction(
    accounts: LiquidatePerfectDexInstructionAccounts,
    args: LiquidatePerfectDexInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        accounts.signerTokenAccount
            ? { pubkey: accounts.signerTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.to, isSigner: false, isWritable: false },
        accounts.toTokenAccount
            ? { pubkey: accounts.toTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        accounts.supplyToken
            ? { pubkey: accounts.supplyToken, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowToken
            ? { pubkey: accounts.borrowToken, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.oracle, isSigner: false, isWritable: false },
        { pubkey: accounts.newBranch, isSigner: false, isWritable: true },
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
        accounts.supplyTokenClaimAccount
            ? { pubkey: accounts.supplyTokenClaimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        accounts.vaultSupplyTokenAccount
            ? { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.vaultBorrowTokenAccount
            ? { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyTokenProgram
            ? { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowTokenProgram
            ? { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
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
        { pubkey: accounts.dexProgram, isSigner: false, isWritable: false },
        accounts.dexOracleProgram
            ? { pubkey: accounts.dexOracleProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getLiquidatePerfectDexInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(LIQUIDATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
