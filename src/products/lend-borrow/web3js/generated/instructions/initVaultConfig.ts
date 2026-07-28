import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { findVaultConfigPda } from '../pdas/vaultConfig';
import { findVaultMetadataPda } from '../pdas/vaultMetadata';
import {
    fixEncoderSize,
    getBytesEncoder,
    getI16Encoder,
    getStructEncoder,
    getU16Encoder,
    getU8Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';

export interface InitVaultConfigInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultConfig?: Address;
    vaultMetadata?: Address;
    oracle: Address;
    supplyToken?: Address;
    borrowToken?: Address;
    supplyDex?: Address;
    borrowDex?: Address;
    systemProgram: Address;
}

export interface InitVaultConfigInstructionArgs {
    vaultId: number;
    supplyRateMagnifier: number;
    borrowRateMagnifier: number;
    collateralFactor: number;
    liquidationThreshold: number;
    liquidationMaxLimit: number;
    withdrawGap: number;
    liquidationPenalty: number;
    borrowFee: number;
    vaultType: number;
    rebalancer: Address;
    liquidityProgram: Address;
    oracleProgram: Address;
}

function getInitVaultConfigInstructionDataEncoder(): Encoder<InitVaultConfigInstructionArgs> {
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
        ['vaultType', getU8Encoder()],
        ['rebalancer', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        [
            'liquidityProgram',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
        ['oracleProgram', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export async function createInitVaultConfigInstruction(
    accounts: InitVaultConfigInstructionAccounts,
    args: InitVaultConfigInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vaultConfig = accounts.vaultConfig;
    if (!vaultConfig) {
        const [derived] = await findVaultConfigPda(
            {
                vaultId: args.vaultId,
            },
            programId,
        );
        vaultConfig = derived;
    }
    let vaultMetadata = accounts.vaultMetadata;
    if (!vaultMetadata) {
        const [derived] = await findVaultMetadataPda(
            {
                vaultId: args.vaultId,
            },
            programId,
        );
        vaultMetadata = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: true },
        { pubkey: vaultConfig, isSigner: false, isWritable: true },
        { pubkey: vaultMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.oracle, isSigner: false, isWritable: false },
        accounts.supplyToken
            ? { pubkey: accounts.supplyToken, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowToken
            ? { pubkey: accounts.borrowToken, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.supplyDex
            ? { pubkey: accounts.supplyDex, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.borrowDex
            ? { pubkey: accounts.borrowDex, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitVaultConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('29c245fec4f6e2c3', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
