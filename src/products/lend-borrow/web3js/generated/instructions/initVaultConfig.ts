import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findVaultConfigPda } from '../pdas/vaultConfig';
import { findVaultMetadataPda } from '../pdas/vaultMetadata';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getI16Decoder,
    getI16Encoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU8Decoder,
    getU8Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([41, 194, 69, 254, 196, 246, 226, 195]);

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

function getInitVaultConfigInstructionDataDecoder(): Decoder<InitVaultConfigInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['supplyRateMagnifier', getI16Decoder()],
        ['borrowRateMagnifier', getI16Decoder()],
        ['collateralFactor', getU16Decoder()],
        ['liquidationThreshold', getU16Decoder()],
        ['liquidationMaxLimit', getU16Decoder()],
        ['withdrawGap', getU16Decoder()],
        ['liquidationPenalty', getU16Decoder()],
        ['borrowFee', getU8Decoder()],
        ['vaultType', getU8Decoder()],
        ['rebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['oracleProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitVaultConfigInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultConfig: AccountMeta;
        vaultMetadata: AccountMeta;
        oracle: AccountMeta;
        supplyToken: AccountMeta;
        borrowToken: AccountMeta;
        supplyDex: AccountMeta;
        borrowDex: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitVaultConfigInstructionArgs;
}

export function parseInitVaultConfigInstruction(instruction: TransactionInstruction): ParsedInitVaultConfigInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for InitVaultConfig instruction');
    }
    if (!INIT_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitVaultConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultConfig: instruction.keys[2]!,
            vaultMetadata: instruction.keys[3]!,
            oracle: instruction.keys[4]!,
            supplyToken: instruction.keys[5]!,
            borrowToken: instruction.keys[6]!,
            supplyDex: instruction.keys[7]!,
            borrowDex: instruction.keys[8]!,
            systemProgram: instruction.keys[9]!,
        },
        data: getInitVaultConfigInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitVaultConfigInstruction(
    accounts: InitVaultConfigInstructionAccounts,
    args: InitVaultConfigInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
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
    let data = Buffer.from(getInitVaultConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
