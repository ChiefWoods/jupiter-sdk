import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBytesEncoder,
    getOptionEncoder,
    getStructEncoder,
    getU8Encoder,
    transformEncoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export interface UnpauseUserInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
    userBorrowPosition: Address;
}

export interface UnpauseUserInstructionArgs {
    protocol: Address;
    supplyMint: Address;
    borrowMint: Address;
    supplyStatus: OptionOrNullable<number>;
    borrowStatus: OptionOrNullable<number>;
}

function getUnpauseUserInstructionDataEncoder(): Encoder<UnpauseUserInstructionArgs> {
    return getStructEncoder([
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrowMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyStatus', getOptionEncoder(getU8Encoder())],
        ['borrowStatus', getOptionEncoder(getU8Encoder())],
    ]);
}

export function createUnpauseUserInstruction(
    accounts: UnpauseUserInstructionAccounts,
    args: UnpauseUserInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUnpauseUserInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('477380fcb67eea3e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
