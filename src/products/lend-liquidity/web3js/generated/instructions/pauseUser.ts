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

export interface PauseUserInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
    userBorrowPosition: Address;
}

export interface PauseUserInstructionArgs {
    protocol: Address;
    supplyMint: Address;
    borrowMint: Address;
    supplyStatus: OptionOrNullable<number>;
    borrowStatus: OptionOrNullable<number>;
}

function getPauseUserInstructionDataEncoder(): Encoder<PauseUserInstructionArgs> {
    return getStructEncoder([
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrowMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyStatus', getOptionEncoder(getU8Encoder())],
        ['borrowStatus', getOptionEncoder(getU8Encoder())],
    ]);
}

export function createPauseUserInstruction(
    accounts: PauseUserInstructionAccounts,
    args: PauseUserInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getPauseUserInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('123f2b5eef35650e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
