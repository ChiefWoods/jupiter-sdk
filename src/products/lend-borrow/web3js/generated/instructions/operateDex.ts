import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getBytesDecoder,
    getBytesEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getOperateDexColAmountsDecoder,
    getOperateDexColAmountsEncoder,
    type OperateDexColAmountsArgs,
} from '../types/operateDexColAmounts';
import {
    getOperateDexDebtAmountsDecoder,
    getOperateDexDebtAmountsEncoder,
    type OperateDexDebtAmountsArgs,
} from '../types/operateDexDebtAmounts';
import { getTransferTypeDecoder, getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

export const OPERATE_DEX_INSTRUCTION_DISCRIMINATOR = new Uint8Array([223, 122, 223, 181, 133, 132, 116, 33]);

export interface OperateDexInstructionAccounts {
    signer: Address;
    signerSupplyTokenAccount?: Address;
    signerBorrowTokenAccount?: Address;
    recipient?: Address;
    recipientBorrowTokenAccount?: Address;
    recipientSupplyTokenAccount?: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken?: Address;
    borrowToken?: Address;
    oracle: Address;
    position: Address;
    positionTokenAccount: Address;
    currentPositionTick: Address;
    finalPositionTick: Address;
    currentPositionTickId: Address;
    finalPositionTickId: Address;
    newBranch: Address;
    supplyTokenReservesLiquidity?: Address;
    borrowTokenReservesLiquidity?: Address;
    vaultSupplyPositionOnLiquidity?: Address;
    vaultBorrowPositionOnLiquidity?: Address;
    supplyRateModel?: Address;
    borrowRateModel?: Address;
    vaultSupplyTokenAccount?: Address;
    vaultBorrowTokenAccount?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    oracleProgram: Address;
    supplyTokenProgram?: Address;
    borrowTokenProgram?: Address;
    systemProgram: Address;
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
}

export interface OperateDexInstructionArgs {
    colAmounts: OptionOrNullable<OperateDexColAmountsArgs>;
    debtAmounts: OptionOrNullable<OperateDexDebtAmountsArgs>;
    transferType: OptionOrNullable<TransferTypeArgs>;
    remainingAccountsIndices: ReadonlyUint8Array;
}

function getOperateDexInstructionDataEncoder(): Encoder<OperateDexInstructionArgs> {
    return getStructEncoder([
        ['colAmounts', getOptionEncoder(getOperateDexColAmountsEncoder())],
        ['debtAmounts', getOptionEncoder(getOperateDexDebtAmountsEncoder())],
        ['transferType', getOptionEncoder(getTransferTypeEncoder())],
        ['remainingAccountsIndices', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

function getOperateDexInstructionDataDecoder(): Decoder<OperateDexInstructionArgs> {
    return getStructDecoder([
        ['colAmounts', getOptionDecoder(getOperateDexColAmountsDecoder())],
        ['debtAmounts', getOptionDecoder(getOperateDexDebtAmountsDecoder())],
        ['transferType', getOptionDecoder(getTransferTypeDecoder())],
        ['remainingAccountsIndices', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ]);
}

export interface ParsedOperateDexInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerSupplyTokenAccount: AccountMeta;
        signerBorrowTokenAccount: AccountMeta;
        recipient: AccountMeta;
        recipientBorrowTokenAccount: AccountMeta;
        recipientSupplyTokenAccount: AccountMeta;
        vaultConfig: AccountMeta;
        vaultState: AccountMeta;
        supplyToken: AccountMeta;
        borrowToken: AccountMeta;
        oracle: AccountMeta;
        position: AccountMeta;
        positionTokenAccount: AccountMeta;
        currentPositionTick: AccountMeta;
        finalPositionTick: AccountMeta;
        currentPositionTickId: AccountMeta;
        finalPositionTickId: AccountMeta;
        newBranch: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
        vaultSupplyPositionOnLiquidity: AccountMeta;
        vaultBorrowPositionOnLiquidity: AccountMeta;
        supplyRateModel: AccountMeta;
        borrowRateModel: AccountMeta;
        vaultSupplyTokenAccount: AccountMeta;
        vaultBorrowTokenAccount: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        oracleProgram: AccountMeta;
        supplyTokenProgram: AccountMeta;
        borrowTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
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
    };
    data: OperateDexInstructionArgs;
}

export function parseOperateDexInstruction(instruction: TransactionInstruction): ParsedOperateDexInstruction {
    if (instruction.keys.length < 73) {
        throw new Error('Expected 73 account metas for OperateDex instruction');
    }
    if (!OPERATE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('OperateDex instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerSupplyTokenAccount: instruction.keys[1]!,
            signerBorrowTokenAccount: instruction.keys[2]!,
            recipient: instruction.keys[3]!,
            recipientBorrowTokenAccount: instruction.keys[4]!,
            recipientSupplyTokenAccount: instruction.keys[5]!,
            vaultConfig: instruction.keys[6]!,
            vaultState: instruction.keys[7]!,
            supplyToken: instruction.keys[8]!,
            borrowToken: instruction.keys[9]!,
            oracle: instruction.keys[10]!,
            position: instruction.keys[11]!,
            positionTokenAccount: instruction.keys[12]!,
            currentPositionTick: instruction.keys[13]!,
            finalPositionTick: instruction.keys[14]!,
            currentPositionTickId: instruction.keys[15]!,
            finalPositionTickId: instruction.keys[16]!,
            newBranch: instruction.keys[17]!,
            supplyTokenReservesLiquidity: instruction.keys[18]!,
            borrowTokenReservesLiquidity: instruction.keys[19]!,
            vaultSupplyPositionOnLiquidity: instruction.keys[20]!,
            vaultBorrowPositionOnLiquidity: instruction.keys[21]!,
            supplyRateModel: instruction.keys[22]!,
            borrowRateModel: instruction.keys[23]!,
            vaultSupplyTokenAccount: instruction.keys[24]!,
            vaultBorrowTokenAccount: instruction.keys[25]!,
            liquidity: instruction.keys[26]!,
            liquidityProgram: instruction.keys[27]!,
            oracleProgram: instruction.keys[28]!,
            supplyTokenProgram: instruction.keys[29]!,
            borrowTokenProgram: instruction.keys[30]!,
            systemProgram: instruction.keys[31]!,
            supplyDexDex: instruction.keys[32]!,
            supplyDexDexPosition: instruction.keys[33]!,
            supplyDexDexUserToken0Account: instruction.keys[34]!,
            supplyDexDexUserToken1Account: instruction.keys[35]!,
            supplyDexDexToken0: instruction.keys[36]!,
            supplyDexDexToken1: instruction.keys[37]!,
            supplyDexDexToken0Reserve: instruction.keys[38]!,
            supplyDexDexToken1Reserve: instruction.keys[39]!,
            supplyDexDexToken0RateModel: instruction.keys[40]!,
            supplyDexDexToken1RateModel: instruction.keys[41]!,
            supplyDexDexToken0Vault: instruction.keys[42]!,
            supplyDexDexToken1Vault: instruction.keys[43]!,
            supplyDexSupplyPosToken0: instruction.keys[44]!,
            supplyDexSupplyPosToken1: instruction.keys[45]!,
            supplyDexBorrowPosToken0: instruction.keys[46]!,
            supplyDexBorrowPosToken1: instruction.keys[47]!,
            supplyDexDexToken0Program: instruction.keys[48]!,
            supplyDexDexToken1Program: instruction.keys[49]!,
            supplyDexDexRecipientToken0Account: instruction.keys[50]!,
            supplyDexDexRecipientToken1Account: instruction.keys[51]!,
            borrowDexDex: instruction.keys[52]!,
            borrowDexDexPosition: instruction.keys[53]!,
            borrowDexDexUserToken0Account: instruction.keys[54]!,
            borrowDexDexUserToken1Account: instruction.keys[55]!,
            borrowDexDexToken0: instruction.keys[56]!,
            borrowDexDexToken1: instruction.keys[57]!,
            borrowDexDexToken0Reserve: instruction.keys[58]!,
            borrowDexDexToken1Reserve: instruction.keys[59]!,
            borrowDexDexToken0RateModel: instruction.keys[60]!,
            borrowDexDexToken1RateModel: instruction.keys[61]!,
            borrowDexDexToken0Vault: instruction.keys[62]!,
            borrowDexDexToken1Vault: instruction.keys[63]!,
            borrowDexSupplyPosToken0: instruction.keys[64]!,
            borrowDexSupplyPosToken1: instruction.keys[65]!,
            borrowDexBorrowPosToken0: instruction.keys[66]!,
            borrowDexBorrowPosToken1: instruction.keys[67]!,
            borrowDexDexToken0Program: instruction.keys[68]!,
            borrowDexDexToken1Program: instruction.keys[69]!,
            borrowDexDexRecipientToken0Account: instruction.keys[70]!,
            borrowDexDexRecipientToken1Account: instruction.keys[71]!,
            dexProgram: instruction.keys[72]!,
        },
        data: getOperateDexInstructionDataDecoder().decode(instructionData),
    };
}

export function createOperateDexInstruction(
    accounts: OperateDexInstructionAccounts,
    args: OperateDexInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        accounts.signerSupplyTokenAccount
            ? { pubkey: accounts.signerSupplyTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.signerBorrowTokenAccount
            ? { pubkey: accounts.signerBorrowTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipient
            ? { pubkey: accounts.recipient, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientBorrowTokenAccount
            ? { pubkey: accounts.recipientBorrowTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientSupplyTokenAccount
            ? { pubkey: accounts.recipientSupplyTokenAccount, isSigner: false, isWritable: true }
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
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.positionTokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.currentPositionTick, isSigner: false, isWritable: true },
        { pubkey: accounts.finalPositionTick, isSigner: false, isWritable: true },
        { pubkey: accounts.currentPositionTickId, isSigner: false, isWritable: false },
        { pubkey: accounts.finalPositionTickId, isSigner: false, isWritable: true },
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
        accounts.vaultSupplyTokenAccount
            ? { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.vaultBorrowTokenAccount
            ? { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
        accounts.supplyTokenProgram
            ? { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowTokenProgram
            ? { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
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
    ];
    let data = Buffer.from(getOperateDexInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(OPERATE_DEX_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
