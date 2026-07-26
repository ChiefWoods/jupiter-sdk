import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { TransferType, transferTypeCodec } from '../types/transferType';
import { VAULTS_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    getBytesCodec,
    getI128Codec,
    getOptionCodec,
    getStructCodec,
    getU32Codec,
} from '@solana/codecs';

export interface OperateInstructionAccounts {
    signer: Address;
    signerSupplyTokenAccount?: Address;
    signerBorrowTokenAccount?: Address;
    recipient?: Address;
    recipientBorrowTokenAccount?: Address;
    recipientSupplyTokenAccount?: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken: Address;
    borrowToken: Address;
    oracle: Address;
    position: Address;
    positionTokenAccount: Address;
    currentPositionTick: Address;
    finalPositionTick: Address;
    currentPositionTickId: Address;
    finalPositionTickId: Address;
    newBranch: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
    vaultSupplyPositionOnLiquidity: Address;
    vaultBorrowPositionOnLiquidity: Address;
    supplyRateModel: Address;
    borrowRateModel: Address;
    vaultSupplyTokenAccount: Address;
    vaultBorrowTokenAccount: Address;
    supplyTokenClaimAccount?: Address;
    borrowTokenClaimAccount?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    oracleProgram: Address;
    supplyTokenProgram: Address;
    borrowTokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
}

export interface OperateInstructionArgs {
    newCol: bigint;
    newDebt: bigint;
    transferType: TransferType | null;
    remainingAccountsIndices: Uint8Array;
}

const OperateInstructionDataCodec = getStructCodec([
    ['newCol', getI128Codec()],
    ['newDebt', getI128Codec()],
    ['transferType', getOptionCodec(transferTypeCodec)],
    ['remainingAccountsIndices', addCodecSizePrefix(getBytesCodec(), getU32Codec())],
]);

export function createOperateInstruction(
    accounts: OperateInstructionAccounts,
    args: OperateInstructionArgs,
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
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyToken, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowToken, isSigner: false, isWritable: false },
        { pubkey: accounts.oracle, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.positionTokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.currentPositionTick, isSigner: false, isWritable: true },
        { pubkey: accounts.finalPositionTick, isSigner: false, isWritable: true },
        { pubkey: accounts.currentPositionTickId, isSigner: false, isWritable: false },
        { pubkey: accounts.finalPositionTickId, isSigner: false, isWritable: true },
        { pubkey: accounts.newBranch, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true },
        accounts.supplyTokenClaimAccount
            ? { pubkey: accounts.supplyTokenClaimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowTokenClaimAccount
            ? { pubkey: accounts.borrowTokenClaimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(OperateInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('d96ad06374972a87', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
