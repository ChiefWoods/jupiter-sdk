import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getF32Decoder,
    getF32Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getJumpRateStateDecoder, getJumpRateStateEncoder, type JumpRateStateArgs } from '../types/jumpRateState';
import { getOracleParamsDecoder, getOracleParamsEncoder, type OracleParamsArgs } from '../types/oracleParams';
import { getPermissionsDecoder, getPermissionsEncoder, type PermissionsArgs } from '../types/permissions';
import { getPricingParamsDecoder, getPricingParamsEncoder, type PricingParamsArgs } from '../types/pricingParams';

export const ADD_CUSTODY_INSTRUCTION_DISCRIMINATOR = new Uint8Array([247, 254, 126, 17, 26, 6, 215, 117]);

export interface AddCustodyInstructionAccounts {
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyTokenAccount: Address;
    custodyTokenMint: Address;
    systemProgram: Address;
    tokenProgram: Address;
    rent: Address;
}

export interface AddCustodyInstructionArgs {
    isStable: boolean;
    oracle: OracleParamsArgs;
    pricing: PricingParamsArgs;
    permissions: PermissionsArgs;
    hourlyFundingDbps: number | bigint;
    targetRatioBps: number | bigint;
    increasePositionBps: number | bigint;
    decreasePositionBps: number | bigint;
    dovesOracle: Address;
    maxPositionSizeUsd: number | bigint;
    jumpRate: JumpRateStateArgs;
    priceImpactFeeFactor: number | bigint;
    priceImpactExponent: number;
    deltaImbalanceThresholdDecimal: number | bigint;
    maxFeeBps: number | bigint;
    dovesAgOracle: Address;
}

function getAddCustodyInstructionDataEncoder(): Encoder<AddCustodyInstructionArgs> {
    return getStructEncoder([
        ['isStable', getBooleanEncoder()],
        ['oracle', getOracleParamsEncoder()],
        ['pricing', getPricingParamsEncoder()],
        ['permissions', getPermissionsEncoder()],
        ['hourlyFundingDbps', getU64Encoder()],
        ['targetRatioBps', getU64Encoder()],
        ['increasePositionBps', getU64Encoder()],
        ['decreasePositionBps', getU64Encoder()],
        ['dovesOracle', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['maxPositionSizeUsd', getU64Encoder()],
        ['jumpRate', getJumpRateStateEncoder()],
        ['priceImpactFeeFactor', getU64Encoder()],
        ['priceImpactExponent', getF32Encoder()],
        ['deltaImbalanceThresholdDecimal', getU64Encoder()],
        ['maxFeeBps', getU64Encoder()],
        ['dovesAgOracle', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getAddCustodyInstructionDataDecoder(): Decoder<AddCustodyInstructionArgs> {
    return getStructDecoder([
        ['isStable', getBooleanDecoder()],
        ['oracle', getOracleParamsDecoder()],
        ['pricing', getPricingParamsDecoder()],
        ['permissions', getPermissionsDecoder()],
        ['hourlyFundingDbps', getU64Decoder()],
        ['targetRatioBps', getU64Decoder()],
        ['increasePositionBps', getU64Decoder()],
        ['decreasePositionBps', getU64Decoder()],
        ['dovesOracle', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['maxPositionSizeUsd', getU64Decoder()],
        ['jumpRate', getJumpRateStateDecoder()],
        ['priceImpactFeeFactor', getU64Decoder()],
        ['priceImpactExponent', getF32Decoder()],
        ['deltaImbalanceThresholdDecimal', getU64Decoder()],
        ['maxFeeBps', getU64Decoder()],
        ['dovesAgOracle', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedAddCustodyInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyTokenAccount: AccountMeta;
        custodyTokenMint: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: AddCustodyInstructionArgs;
}

export function parseAddCustodyInstruction(instruction: TransactionInstruction): ParsedAddCustodyInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for AddCustody instruction');
    }
    if (!ADD_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('AddCustody instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            transferAuthority: instruction.keys[1]!,
            perpetuals: instruction.keys[2]!,
            pool: instruction.keys[3]!,
            custody: instruction.keys[4]!,
            custodyTokenAccount: instruction.keys[5]!,
            custodyTokenMint: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            rent: instruction.keys[9]!,
        },
        data: getAddCustodyInstructionDataDecoder().decode(instructionData),
    };
}

export function createAddCustodyInstruction(
    accounts: AddCustodyInstructionAccounts,
    args: AddCustodyInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getAddCustodyInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ADD_CUSTODY_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
