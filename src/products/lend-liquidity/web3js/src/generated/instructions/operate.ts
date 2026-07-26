import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { TransferType, transferTypeCodec } from '../types/transferType';
import { fixCodecSize, getBytesCodec, getI128Codec, getStructCodec, transformCodec } from '@solana/codecs';

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
    supplyAmount: bigint;
    borrowAmount: bigint;
    withdrawTo: Address;
    borrowTo: Address;
    transferType: TransferType;
}

const OperateInstructionDataCodec = getStructCodec([
    ['supplyAmount', getI128Codec()],
    ['borrowAmount', getI128Codec()],
    [
        'withdrawTo',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'borrowTo',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['transferType', transferTypeCodec],
]);

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
    const instructionData = Buffer.from(OperateInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('d96ad06374972a87', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
