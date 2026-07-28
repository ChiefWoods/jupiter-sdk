import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getBytesEncoder,
    getOptionEncoder,
    getStructEncoder,
    getU32Encoder,
    type Encoder,
    type OptionOrNullable,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getOperatePerfectDexColAmountsEncoder,
    type OperatePerfectDexColAmountsArgs,
} from '../types/operatePerfectDexColAmounts';
import {
    getOperatePerfectDexDebtAmountsEncoder,
    type OperatePerfectDexDebtAmountsArgs,
} from '../types/operatePerfectDexDebtAmounts';
import { getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

export interface OperatePerfectDexInstructionAccounts {
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

export interface OperatePerfectDexInstructionArgs {
    colAmounts: OptionOrNullable<OperatePerfectDexColAmountsArgs>;
    debtAmounts: OptionOrNullable<OperatePerfectDexDebtAmountsArgs>;
    transferType: OptionOrNullable<TransferTypeArgs>;
    remainingAccountsIndices: ReadonlyUint8Array;
}

function getOperatePerfectDexInstructionDataEncoder(): Encoder<OperatePerfectDexInstructionArgs> {
    return getStructEncoder([
        ['colAmounts', getOptionEncoder(getOperatePerfectDexColAmountsEncoder())],
        ['debtAmounts', getOptionEncoder(getOperatePerfectDexDebtAmountsEncoder())],
        ['transferType', getOptionEncoder(getTransferTypeEncoder())],
        ['remainingAccountsIndices', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

export function createOperatePerfectDexInstruction(
    accounts: OperatePerfectDexInstructionAccounts,
    args: OperatePerfectDexInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
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
    const instructionData = Buffer.from(getOperatePerfectDexInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('5822b44d98baa6a2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
