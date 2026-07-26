import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI16Codec, getStructCodec, getU16Codec, getU8Codec } from '@solana/codecs';

export interface UpdateCoreSettingsInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateCoreSettingsInstructionArgs {
    vaultId: number;
    supplyRateMagnifier: number;
    borrowRateMagnifier: number;
    collateralFactor: number;
    liquidationThreshold: number;
    liquidationMaxLimit: number;
    withdrawGap: number;
    liquidationPenalty: number;
    borrowFee: number;
}

const UpdateCoreSettingsInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['supplyRateMagnifier', getI16Codec()],
    ['borrowRateMagnifier', getI16Codec()],
    ['collateralFactor', getU16Codec()],
    ['liquidationThreshold', getU16Codec()],
    ['liquidationMaxLimit', getU16Codec()],
    ['withdrawGap', getU16Codec()],
    ['liquidationPenalty', getU16Codec()],
    ['borrowFee', getU8Codec()],
]);

export function createUpdateCoreSettingsInstruction(
    accounts: UpdateCoreSettingsInstructionAccounts,
    args: UpdateCoreSettingsInstructionArgs,
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
    const instructionData = Buffer.from(UpdateCoreSettingsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('6554090b3c6895ea', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
