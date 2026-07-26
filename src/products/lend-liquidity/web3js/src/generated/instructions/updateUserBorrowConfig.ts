import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { UserBorrowConfig, userBorrowConfigCodec } from '../types/userBorrowConfig';
import { getStructCodec } from '@solana/codecs';

export interface UpdateUserBorrowConfigInstructionAccounts {
    authority: Address;
    protocol: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
    userBorrowPosition: Address;
}

export interface UpdateUserBorrowConfigInstructionArgs {
    userBorrowConfig: UserBorrowConfig;
}

const UpdateUserBorrowConfigInstructionDataCodec = getStructCodec([['userBorrowConfig', userBorrowConfigCodec]]);

export function createUpdateUserBorrowConfigInstruction(
    accounts: UpdateUserBorrowConfigInstructionAccounts,
    args: UpdateUserBorrowConfigInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.protocol, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateUserBorrowConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('64b0c9aef70236a8', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
