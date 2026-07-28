import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU128Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';

export interface UpdateUserWithdrawalLimitInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
}

export interface UpdateUserWithdrawalLimitInstructionArgs {
    newLimit: number | bigint;
    protocol: Address;
    mint: Address;
}

function getUpdateUserWithdrawalLimitInstructionDataEncoder(): Encoder<UpdateUserWithdrawalLimitInstructionArgs> {
    return getStructEncoder([
        ['newLimit', getU128Encoder()],
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createUpdateUserWithdrawalLimitInstruction(
    accounts: UpdateUserWithdrawalLimitInstructionAccounts,
    args: UpdateUserWithdrawalLimitInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateUserWithdrawalLimitInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a209ba09d51ead4e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
