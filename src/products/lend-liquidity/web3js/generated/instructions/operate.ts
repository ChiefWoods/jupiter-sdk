import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBytesEncoder,
    getI128Encoder,
    getStructEncoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';
import { getTransferTypeEncoder, type TransferTypeArgs } from '../types/transferType';

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

export function createOperateInstruction(
    accounts: OperateInstructionAccounts,
    args: OperateInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
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
    const instructionData = Buffer.from(getOperateInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d96ad06374972a87', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
