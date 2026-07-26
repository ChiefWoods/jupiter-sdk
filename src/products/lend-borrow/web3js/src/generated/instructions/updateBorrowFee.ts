import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec, getU8Codec } from '@solana/codecs';

export interface UpdateBorrowFeeInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateBorrowFeeInstructionArgs {
    vaultId: number;
    borrowFee: number;
}

const UpdateBorrowFeeInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['borrowFee', getU8Codec()],
]);

export function createUpdateBorrowFeeInstruction(
    accounts: UpdateBorrowFeeInstructionAccounts,
    args: UpdateBorrowFeeInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(UpdateBorrowFeeInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('fb7c2394caa79d41', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
