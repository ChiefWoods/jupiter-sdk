import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI16Encoder, getStructEncoder, getU16Encoder, getU8Encoder, type Encoder } from '@solana/codecs';

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

function getUpdateCoreSettingsInstructionDataEncoder(): Encoder<UpdateCoreSettingsInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['supplyRateMagnifier', getI16Encoder()],
        ['borrowRateMagnifier', getI16Encoder()],
        ['collateralFactor', getU16Encoder()],
        ['liquidationThreshold', getU16Encoder()],
        ['liquidationMaxLimit', getU16Encoder()],
        ['withdrawGap', getU16Encoder()],
        ['liquidationPenalty', getU16Encoder()],
        ['borrowFee', getU8Encoder()],
    ]);
}

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
    const instructionData = Buffer.from(getUpdateCoreSettingsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('6554090b3c6895ea', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
