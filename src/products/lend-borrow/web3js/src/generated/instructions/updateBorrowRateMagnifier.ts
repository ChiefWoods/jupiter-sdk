import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI16Codec, getStructCodec, getU16Codec } from '@solana/codecs';

export interface UpdateBorrowRateMagnifierInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateBorrowRateMagnifierInstructionArgs {
    vaultId: number;
    borrowRateMagnifier: number;
}

const UpdateBorrowRateMagnifierInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['borrowRateMagnifier', getI16Codec()],
]);

export function createUpdateBorrowRateMagnifierInstruction(
    accounts: UpdateBorrowRateMagnifierInstructionAccounts,
    args: UpdateBorrowRateMagnifierInstructionArgs,
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
    const instructionData = Buffer.from(UpdateBorrowRateMagnifierInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('4bfa1bb09c351a70', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
