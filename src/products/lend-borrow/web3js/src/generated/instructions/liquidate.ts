import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { TransferType, transferTypeCodec } from '../types/transferType';
import { VAULTS_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    getBooleanCodec,
    getBytesCodec,
    getOptionCodec,
    getStructCodec,
    getU128Codec,
    getU32Codec,
    getU64Codec,
} from '@solana/codecs';

export interface LiquidateInstructionAccounts {
    signer: Address;
    signerTokenAccount: Address;
    to: Address;
    toTokenAccount: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken: Address;
    borrowToken: Address;
    oracle: Address;
    newBranch: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
    vaultSupplyPositionOnLiquidity: Address;
    vaultBorrowPositionOnLiquidity: Address;
    supplyRateModel: Address;
    borrowRateModel: Address;
    supplyTokenClaimAccount?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    vaultSupplyTokenAccount: Address;
    vaultBorrowTokenAccount: Address;
    supplyTokenProgram: Address;
    borrowTokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram?: Address;
    oracleProgram: Address;
}

export interface LiquidateInstructionArgs {
    debtAmt: bigint;
    colPerUnitDebt: bigint;
    absorb: boolean;
    transferType: TransferType | null;
    remainingAccountsIndices: Uint8Array;
}

const LiquidateInstructionDataCodec = getStructCodec([
    ['debtAmt', getU64Codec()],
    ['colPerUnitDebt', getU128Codec()],
    ['absorb', getBooleanCodec()],
    ['transferType', getOptionCodec(transferTypeCodec)],
    ['remainingAccountsIndices', addCodecSizePrefix(getBytesCodec(), getU32Codec())],
]);

export function createLiquidateInstruction(
    accounts: LiquidateInstructionAccounts,
    args: LiquidateInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.to, isSigner: false, isWritable: false },
        { pubkey: accounts.toTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyToken, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowToken, isSigner: false, isWritable: false },
        { pubkey: accounts.oracle, isSigner: false, isWritable: false },
        { pubkey: accounts.newBranch, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowRateModel, isSigner: false, isWritable: false },
        accounts.supplyTokenClaimAccount
            ? { pubkey: accounts.supplyTokenClaimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(LiquidateInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('dfb3e27d302e274a', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
