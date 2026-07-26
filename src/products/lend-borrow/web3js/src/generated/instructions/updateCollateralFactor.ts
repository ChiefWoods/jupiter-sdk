import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec } from '@solana/codecs';

export interface UpdateCollateralFactorInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateCollateralFactorInstructionArgs {
    vaultId: number;
    collateralFactor: number;
}

const UpdateCollateralFactorInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['collateralFactor', getU16Codec()],
]);

export function createUpdateCollateralFactorInstruction(
    accounts: UpdateCollateralFactorInstructionAccounts,
    args: UpdateCollateralFactorInstructionArgs,
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
    const instructionData = Buffer.from(UpdateCollateralFactorInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('f453e3d7dc52c9dd', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
