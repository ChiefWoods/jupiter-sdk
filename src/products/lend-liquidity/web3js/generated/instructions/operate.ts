import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getI128Decoder,
    getI128Encoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getTransferTypeDecoder, getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

export const OPERATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([217, 106, 208, 99, 116, 151, 42, 135]);

export interface OperateInstructionAccounts {
    protocol: Address;
    liquidity: Address;
    tokenReserve: Address;
    mint: Address;
    vault: Address;
    userSupplyPosition?: Address;
    userBorrowPosition?: Address;
    rateModel: Address;
    withdrawToAccount?: Address;
    borrowToAccount?: Address;
    borrowClaimAccount?: Address;
    withdrawClaimAccount?: Address;
    tokenProgram: Address;
}

export interface OperateInstructionArgs {
    supplyAmount: number | bigint;
    borrowAmount: number | bigint;
    withdrawTo: Address;
    borrowTo: Address;
    transferType: TransferTypeArgs;
}

function getOperateInstructionDataEncoder(): Encoder<OperateInstructionArgs> {
    return getStructEncoder([
        ['supplyAmount', getI128Encoder()],
        ['borrowAmount', getI128Encoder()],
        ['withdrawTo', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrowTo', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['transferType', getTransferTypeEncoder()],
    ]);
}

function getOperateInstructionDataDecoder(): Decoder<OperateInstructionArgs> {
    return getStructDecoder([
        ['supplyAmount', getI128Decoder()],
        ['borrowAmount', getI128Decoder()],
        ['withdrawTo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrowTo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['transferType', getTransferTypeDecoder()],
    ]);
}

export interface ParsedOperateInstruction {
    programId: Address;
    accounts: {
        protocol: AccountMeta;
        liquidity: AccountMeta;
        tokenReserve: AccountMeta;
        mint: AccountMeta;
        vault: AccountMeta;
        userSupplyPosition: AccountMeta;
        userBorrowPosition: AccountMeta;
        rateModel: AccountMeta;
        withdrawToAccount: AccountMeta;
        borrowToAccount: AccountMeta;
        borrowClaimAccount: AccountMeta;
        withdrawClaimAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: OperateInstructionArgs;
}

export function parseOperateInstruction(instruction: TransactionInstruction): ParsedOperateInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for Operate instruction');
    }
    if (!OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Operate instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            protocol: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            tokenReserve: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            vault: instruction.keys[4]!,
            userSupplyPosition: instruction.keys[5]!,
            userBorrowPosition: instruction.keys[6]!,
            rateModel: instruction.keys[7]!,
            withdrawToAccount: instruction.keys[8]!,
            borrowToAccount: instruction.keys[9]!,
            borrowClaimAccount: instruction.keys[10]!,
            withdrawClaimAccount: instruction.keys[11]!,
            tokenProgram: instruction.keys[12]!,
        },
        data: getOperateInstructionDataDecoder().decode(instructionData),
    };
}

export function createOperateInstruction(
    accounts: OperateInstructionAccounts,
    args: OperateInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.protocol, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        accounts.userSupplyPosition
            ? { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.userBorrowPosition
            ? { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        accounts.withdrawToAccount
            ? { pubkey: accounts.withdrawToAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowToAccount
            ? { pubkey: accounts.borrowToAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowClaimAccount
            ? { pubkey: accounts.borrowClaimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.withdrawClaimAccount
            ? { pubkey: accounts.withdrawClaimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
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
