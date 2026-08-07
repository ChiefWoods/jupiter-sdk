import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getBytesDecoder,
    getBytesEncoder,
    getI128Decoder,
    getI128Encoder,
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
import { getTransferTypeDecoder, getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

export const OPERATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([217, 106, 208, 99, 116, 151, 42, 135]);

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
    newCol: number | bigint;
    newDebt: number | bigint;
    transferType: OptionOrNullable<TransferTypeArgs>;
    remainingAccountsIndices: ReadonlyUint8Array;
}

function getOperateInstructionDataEncoder(): Encoder<OperateInstructionArgs> {
    return getStructEncoder([
        ['newCol', getI128Encoder()],
        ['newDebt', getI128Encoder()],
        ['transferType', getOptionEncoder(getTransferTypeEncoder())],
        ['remainingAccountsIndices', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

function getOperateInstructionDataDecoder(): Decoder<OperateInstructionArgs> {
    return getStructDecoder([
        ['newCol', getI128Decoder()],
        ['newDebt', getI128Decoder()],
        ['transferType', getOptionDecoder(getTransferTypeDecoder())],
        ['remainingAccountsIndices', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ]);
}

export interface ParsedOperateInstruction {
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
        supplyTokenClaimAccount: AccountMeta;
        borrowTokenClaimAccount: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        oracleProgram: AccountMeta;
        supplyTokenProgram: AccountMeta;
        borrowTokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: OperateInstructionArgs;
}

export function parseOperateInstruction(instruction: TransactionInstruction): ParsedOperateInstruction {
    if (instruction.keys.length < 35) {
        throw new Error('Expected 35 account metas for Operate instruction');
    }
    if (!OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Operate instruction discriminator mismatch');
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
            supplyTokenClaimAccount: instruction.keys[26]!,
            borrowTokenClaimAccount: instruction.keys[27]!,
            liquidity: instruction.keys[28]!,
            liquidityProgram: instruction.keys[29]!,
            oracleProgram: instruction.keys[30]!,
            supplyTokenProgram: instruction.keys[31]!,
            borrowTokenProgram: instruction.keys[32]!,
            associatedTokenProgram: instruction.keys[33]!,
            systemProgram: instruction.keys[34]!,
        },
        data: getOperateInstructionDataDecoder().decode(instructionData),
    };
}

export function createOperateInstruction(
    accounts: OperateInstructionAccounts,
    args: OperateInstructionArgs,
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
    let data = Buffer.from(getOperateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(OPERATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
