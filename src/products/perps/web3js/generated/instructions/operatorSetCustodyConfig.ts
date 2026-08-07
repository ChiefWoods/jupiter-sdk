import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getF32Decoder,
    getF32Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getBorrowLendParamsDecoder,
    getBorrowLendParamsEncoder,
    type BorrowLendParamsArgs,
} from '../types/borrowLendParams';
import { getJumpRateStateDecoder, getJumpRateStateEncoder, type JumpRateStateArgs } from '../types/jumpRateState';
import { getPricingParamsDecoder, getPricingParamsEncoder, type PricingParamsArgs } from '../types/pricingParams';

export const OPERATOR_SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    166, 137, 92, 204, 145, 224, 24, 218,
]);

export interface OperatorSetCustodyConfigInstructionAccounts {
    operator: Address;
    custody: Address;
}

export interface OperatorSetCustodyConfigInstructionArgs {
    pricing: PricingParamsArgs;
    hourlyFundingDbps: number | bigint;
    targetRatioBps: number | bigint;
    increasePositionBps: number | bigint;
    decreasePositionBps: number | bigint;
    maxPositionSizeUsd: number | bigint;
    jumpRate: JumpRateStateArgs;
    priceImpactFeeFactor: number | bigint;
    priceImpactExponent: number;
    deltaImbalanceThresholdDecimal: number | bigint;
    maxFeeBps: number | bigint;
    borrowLendParameters: BorrowLendParamsArgs;
    borrowHourlyFundingDbps: number | bigint;
    borrowLimitInTokenAmount: number | bigint;
    minInterestFeeBps: number | bigint;
    minInterestFeeGracePeriodSeconds: number | bigint;
    maxTotalStakedAmountLamports: number | bigint;
    externalSwapFeeMultiplierBps: number | bigint;
    disableClosePositionRequest: boolean;
    withdrawalLimitTokenAmount: number | bigint;
    withdrawalLimitIntervalSeconds: number | bigint;
}

function getOperatorSetCustodyConfigInstructionDataEncoder(): Encoder<OperatorSetCustodyConfigInstructionArgs> {
    return getStructEncoder([
        ['pricing', getPricingParamsEncoder()],
        ['hourlyFundingDbps', getU64Encoder()],
        ['targetRatioBps', getU64Encoder()],
        ['increasePositionBps', getU64Encoder()],
        ['decreasePositionBps', getU64Encoder()],
        ['maxPositionSizeUsd', getU64Encoder()],
        ['jumpRate', getJumpRateStateEncoder()],
        ['priceImpactFeeFactor', getU64Encoder()],
        ['priceImpactExponent', getF32Encoder()],
        ['deltaImbalanceThresholdDecimal', getU64Encoder()],
        ['maxFeeBps', getU64Encoder()],
        ['borrowLendParameters', getBorrowLendParamsEncoder()],
        ['borrowHourlyFundingDbps', getU64Encoder()],
        ['borrowLimitInTokenAmount', getU64Encoder()],
        ['minInterestFeeBps', getU64Encoder()],
        ['minInterestFeeGracePeriodSeconds', getU64Encoder()],
        ['maxTotalStakedAmountLamports', getU64Encoder()],
        ['externalSwapFeeMultiplierBps', getU64Encoder()],
        ['disableClosePositionRequest', getBooleanEncoder()],
        ['withdrawalLimitTokenAmount', getU64Encoder()],
        ['withdrawalLimitIntervalSeconds', getU64Encoder()],
    ]);
}

function getOperatorSetCustodyConfigInstructionDataDecoder(): Decoder<OperatorSetCustodyConfigInstructionArgs> {
    return getStructDecoder([
        ['pricing', getPricingParamsDecoder()],
        ['hourlyFundingDbps', getU64Decoder()],
        ['targetRatioBps', getU64Decoder()],
        ['increasePositionBps', getU64Decoder()],
        ['decreasePositionBps', getU64Decoder()],
        ['maxPositionSizeUsd', getU64Decoder()],
        ['jumpRate', getJumpRateStateDecoder()],
        ['priceImpactFeeFactor', getU64Decoder()],
        ['priceImpactExponent', getF32Decoder()],
        ['deltaImbalanceThresholdDecimal', getU64Decoder()],
        ['maxFeeBps', getU64Decoder()],
        ['borrowLendParameters', getBorrowLendParamsDecoder()],
        ['borrowHourlyFundingDbps', getU64Decoder()],
        ['borrowLimitInTokenAmount', getU64Decoder()],
        ['minInterestFeeBps', getU64Decoder()],
        ['minInterestFeeGracePeriodSeconds', getU64Decoder()],
        ['maxTotalStakedAmountLamports', getU64Decoder()],
        ['externalSwapFeeMultiplierBps', getU64Decoder()],
        ['disableClosePositionRequest', getBooleanDecoder()],
        ['withdrawalLimitTokenAmount', getU64Decoder()],
        ['withdrawalLimitIntervalSeconds', getU64Decoder()],
    ]);
}

export interface ParsedOperatorSetCustodyConfigInstruction {
    programId: Address;
    accounts: {
        operator: AccountMeta;
        custody: AccountMeta;
    };
    data: OperatorSetCustodyConfigInstructionArgs;
}

export function parseOperatorSetCustodyConfigInstruction(
    instruction: TransactionInstruction,
): ParsedOperatorSetCustodyConfigInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for OperatorSetCustodyConfig instruction');
    }
    if (
        !OPERATOR_SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('OperatorSetCustodyConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operator: instruction.keys[0]!,
            custody: instruction.keys[1]!,
        },
        data: getOperatorSetCustodyConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createOperatorSetCustodyConfigInstruction(
    accounts: OperatorSetCustodyConfigInstructionAccounts,
    args: OperatorSetCustodyConfigInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getOperatorSetCustodyConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(OPERATOR_SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
