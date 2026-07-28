import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBooleanEncoder,
    getBytesEncoder,
    getF32Encoder,
    getStructEncoder,
    getU64Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';
import { getBorrowLendParamsEncoder, type BorrowLendParamsArgs } from '../types/borrowLendParams';
import { getJumpRateStateEncoder, type JumpRateStateArgs } from '../types/jumpRateState';
import { getOracleParamsEncoder, type OracleParamsArgs } from '../types/oracleParams';
import { getPermissionsEncoder, type PermissionsArgs } from '../types/permissions';
import { getPricingParamsEncoder, type PricingParamsArgs } from '../types/pricingParams';

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

export function createSetCustodyConfigInstruction(
    accounts: SetCustodyConfigInstructionAccounts,
    args: SetCustodyConfigInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSetCustodyConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('8561828fd7e524b0', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
