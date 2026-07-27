import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getF32Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';
import { getBorrowLendParamsEncoder, type BorrowLendParamsArgs } from '../types/borrowLendParams';
import { getJumpRateStateEncoder, type JumpRateStateArgs } from '../types/jumpRateState';
import { getPricingParamsEncoder, type PricingParamsArgs } from '../types/pricingParams';

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

export function createOperatorSetCustodyConfigInstruction(
    accounts: OperatorSetCustodyConfigInstructionAccounts,
    args: OperatorSetCustodyConfigInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getOperatorSetCustodyConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a6895ccc91e018da', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
