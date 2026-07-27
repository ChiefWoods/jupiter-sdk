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
import { getJumpRateStateEncoder, type JumpRateStateArgs } from '../types/jumpRateState';
import { getOracleParamsEncoder, type OracleParamsArgs } from '../types/oracleParams';
import { getPermissionsEncoder, type PermissionsArgs } from '../types/permissions';
import { getPricingParamsEncoder, type PricingParamsArgs } from '../types/pricingParams';

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

export function createAddCustodyInstruction(
    accounts: AddCustodyInstructionAccounts,
    args: AddCustodyInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
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
    const instructionData = Buffer.from(getAddCustodyInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('f7fe7e111a06d775', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
