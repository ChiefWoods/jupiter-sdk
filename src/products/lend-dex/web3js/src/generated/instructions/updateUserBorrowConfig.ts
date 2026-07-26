import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec, getU32Codec, getU64Codec } from '@solana/codecs';

export interface UpdateUserBorrowConfigInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserBorrowConfigInstructionArgs {
    expandPercent: number;
    expandDuration: number;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
}

const UpdateUserBorrowConfigInstructionDataCodec = getStructCodec([
    ['expandPercent', getU16Codec()],
    ['expandDuration', getU32Codec()],
    ['baseDebtCeiling', getU64Codec()],
    ['maxDebtCeiling', getU64Codec()],
]);

export function createUpdateUserBorrowConfigInstruction(
    accounts: UpdateUserBorrowConfigInstructionAccounts,
    args: UpdateUserBorrowConfigInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateUserBorrowConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('64b0c9aef70236a8', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
