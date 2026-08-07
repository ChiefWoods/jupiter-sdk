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
import {
    getBorrowLendParamsDecoder,
    getBorrowLendParamsEncoder,
    type BorrowLendParamsArgs,
} from '../types/borrowLendParams';
import { getJumpRateStateDecoder, getJumpRateStateEncoder, type JumpRateStateArgs } from '../types/jumpRateState';
import { getOracleParamsDecoder, getOracleParamsEncoder, type OracleParamsArgs } from '../types/oracleParams';
import { getPermissionsDecoder, getPermissionsEncoder, type PermissionsArgs } from '../types/permissions';
import { getPricingParamsDecoder, getPricingParamsEncoder, type PricingParamsArgs } from '../types/pricingParams';

export const SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([133, 97, 130, 143, 215, 229, 36, 176]);

export interface SetCustodyConfigInstructionAccounts {
    admin: Address;
    perpetuals: Address;
    custody: Address;
}

export interface SetCustodyConfigInstructionArgs {
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
    borrowLendParameters: BorrowLendParamsArgs;
    borrowHourlyFundingDbps: number | bigint;
    borrowLimitInTokenAmount: number | bigint;
    minInterestFeeBps: number | bigint;
    minInterestFeeGracePeriodSeconds: number | bigint;
    maxTotalStakedAmountLamports: number | bigint;
    externalSwapFeeMultiplierBps: number | bigint;
    disableClosePositionRequest: boolean;
    withdrawalLimitIntervalSeconds: number | bigint;
    withdrawalLimitTokenAmount: number | bigint;
}

function getSetCustodyConfigInstructionDataEncoder(): Encoder<SetCustodyConfigInstructionArgs> {
    return getStructEncoder([
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
        ['borrowLendParameters', getBorrowLendParamsEncoder()],
        ['borrowHourlyFundingDbps', getU64Encoder()],
        ['borrowLimitInTokenAmount', getU64Encoder()],
        ['minInterestFeeBps', getU64Encoder()],
        ['minInterestFeeGracePeriodSeconds', getU64Encoder()],
        ['maxTotalStakedAmountLamports', getU64Encoder()],
        ['externalSwapFeeMultiplierBps', getU64Encoder()],
        ['disableClosePositionRequest', getBooleanEncoder()],
        ['withdrawalLimitIntervalSeconds', getU64Encoder()],
        ['withdrawalLimitTokenAmount', getU64Encoder()],
    ]);
}

function getSetCustodyConfigInstructionDataDecoder(): Decoder<SetCustodyConfigInstructionArgs> {
    return getStructDecoder([
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
        ['borrowLendParameters', getBorrowLendParamsDecoder()],
        ['borrowHourlyFundingDbps', getU64Decoder()],
        ['borrowLimitInTokenAmount', getU64Decoder()],
        ['minInterestFeeBps', getU64Decoder()],
        ['minInterestFeeGracePeriodSeconds', getU64Decoder()],
        ['maxTotalStakedAmountLamports', getU64Decoder()],
        ['externalSwapFeeMultiplierBps', getU64Decoder()],
        ['disableClosePositionRequest', getBooleanDecoder()],
        ['withdrawalLimitIntervalSeconds', getU64Decoder()],
        ['withdrawalLimitTokenAmount', getU64Decoder()],
    ]);
}

export interface ParsedSetCustodyConfigInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        perpetuals: AccountMeta;
        custody: AccountMeta;
    };
    data: SetCustodyConfigInstructionArgs;
}

export function parseSetCustodyConfigInstruction(
    instruction: TransactionInstruction,
): ParsedSetCustodyConfigInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SetCustodyConfig instruction');
    }
    if (!SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetCustodyConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            custody: instruction.keys[2]!,
        },
        data: getSetCustodyConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetCustodyConfigInstruction(
    accounts: SetCustodyConfigInstructionAccounts,
    args: SetCustodyConfigInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSetCustodyConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
