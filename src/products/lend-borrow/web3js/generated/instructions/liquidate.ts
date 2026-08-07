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
import { getTransferTypeDecoder, getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

export const LIQUIDATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([223, 179, 226, 125, 48, 46, 39, 74]);

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
    debtAmt: number | bigint;
    colPerUnitDebt: number | bigint;
    absorb: boolean;
    transferType: OptionOrNullable<TransferTypeArgs>;
    remainingAccountsIndices: ReadonlyUint8Array;
}

function getLiquidateInstructionDataEncoder(): Encoder<LiquidateInstructionArgs> {
    return getStructEncoder([
        ['debtAmt', getU64Encoder()],
        ['colPerUnitDebt', getU128Encoder()],
        ['absorb', getBooleanEncoder()],
        ['transferType', getOptionEncoder(getTransferTypeEncoder())],
        ['remainingAccountsIndices', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

function getLiquidateInstructionDataDecoder(): Decoder<LiquidateInstructionArgs> {
    return getStructDecoder([
        ['debtAmt', getU64Decoder()],
        ['colPerUnitDebt', getU128Decoder()],
        ['absorb', getBooleanDecoder()],
        ['transferType', getOptionDecoder(getTransferTypeDecoder())],
        ['remainingAccountsIndices', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ]);
}

export interface ParsedLiquidateInstruction {
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
        associatedTokenProgram: AccountMeta;
        oracleProgram: AccountMeta;
    };
    data: LiquidateInstructionArgs;
}

export function parseLiquidateInstruction(instruction: TransactionInstruction): ParsedLiquidateInstruction {
    if (instruction.keys.length < 26) {
        throw new Error('Expected 26 account metas for Liquidate instruction');
    }
    if (!LIQUIDATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Liquidate instruction discriminator mismatch');
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
            associatedTokenProgram: instruction.keys[24]!,
            oracleProgram: instruction.keys[25]!,
        },
        data: getLiquidateInstructionDataDecoder().decode(instructionData),
    };
}

export function createLiquidateInstruction(
    accounts: LiquidateInstructionAccounts,
    args: LiquidateInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
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
    let data = Buffer.from(getLiquidateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(LIQUIDATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
