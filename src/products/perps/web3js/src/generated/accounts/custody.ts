import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU128Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getAssetsDecoder, type Assets } from '../types/assets';
import { getBorrowLendParamsDecoder, type BorrowLendParams } from '../types/borrowLendParams';
import { getFundingRateStateDecoder, type FundingRateState } from '../types/fundingRateState';
import { getJumpRateStateDecoder, type JumpRateState } from '../types/jumpRateState';
import { getOracleParamsDecoder, type OracleParams } from '../types/oracleParams';
import { getPermissionsDecoder, type Permissions } from '../types/permissions';
import { getPriceImpactBufferDecoder, type PriceImpactBuffer } from '../types/priceImpactBuffer';
import { getPricingParamsDecoder, type PricingParams } from '../types/pricingParams';

export type CustodyAccountData = {
    pool: Address;
    mint: Address;
    tokenAccount: Address;
    decimals: number;
    isStable: boolean;
    oracle: OracleParams;
    pricing: PricingParams;
    permissions: Permissions;
    targetRatioBps: bigint;
    assets: Assets;
    fundingRateState: FundingRateState;
    bump: number;
    tokenAccountBump: number;
    increasePositionBps: bigint;
    decreasePositionBps: bigint;
    maxPositionSizeUsd: bigint;
    dovesOracle: Address;
    jumpRateState: JumpRateState;
    dovesAgOracle: Address;
    priceImpactBuffer: PriceImpactBuffer;
    borrowLendParameters: BorrowLendParams;
    borrowsFundingRateState: FundingRateState;
    debt: bigint;
    borrowLendInterestsAccured: bigint;
    borrowLimitInTokenAmount: bigint;
    minInterestFeeBps: bigint;
    minInterestFeeGracePeriodSeconds: bigint;
    totalStakedAmountLamports: bigint;
    maxTotalStakedAmountLamports: bigint;
    externalSwapFeeMultiplierBps: bigint;
    disableClosePositionRequest: boolean;
    withdrawalLimitTokenAmount: bigint;
    withdrawalTokenAmountAccumulated: bigint;
    withdrawalLimitLastResetAt: bigint;
    withdrawalLimitIntervalSeconds: bigint;
};

export interface CustodyAccount {
    address: Address;
    data: CustodyAccountData;
}

function getCustodyAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    pool: Address;
    mint: Address;
    tokenAccount: Address;
    decimals: number;
    isStable: boolean;
    oracle: OracleParams;
    pricing: PricingParams;
    permissions: Permissions;
    targetRatioBps: bigint;
    assets: Assets;
    fundingRateState: FundingRateState;
    bump: number;
    tokenAccountBump: number;
    increasePositionBps: bigint;
    decreasePositionBps: bigint;
    maxPositionSizeUsd: bigint;
    dovesOracle: Address;
    jumpRateState: JumpRateState;
    dovesAgOracle: Address;
    priceImpactBuffer: PriceImpactBuffer;
    borrowLendParameters: BorrowLendParams;
    borrowsFundingRateState: FundingRateState;
    debt: bigint;
    borrowLendInterestsAccured: bigint;
    borrowLimitInTokenAmount: bigint;
    minInterestFeeBps: bigint;
    minInterestFeeGracePeriodSeconds: bigint;
    totalStakedAmountLamports: bigint;
    maxTotalStakedAmountLamports: bigint;
    externalSwapFeeMultiplierBps: bigint;
    disableClosePositionRequest: boolean;
    withdrawalLimitTokenAmount: bigint;
    withdrawalTokenAmountAccumulated: bigint;
    withdrawalLimitLastResetAt: bigint;
    withdrawalLimitIntervalSeconds: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['decimals', getU8Decoder()],
        ['isStable', getBooleanDecoder()],
        ['oracle', getOracleParamsDecoder()],
        ['pricing', getPricingParamsDecoder()],
        ['permissions', getPermissionsDecoder()],
        ['targetRatioBps', getU64Decoder()],
        ['assets', getAssetsDecoder()],
        ['fundingRateState', getFundingRateStateDecoder()],
        ['bump', getU8Decoder()],
        ['tokenAccountBump', getU8Decoder()],
        ['increasePositionBps', getU64Decoder()],
        ['decreasePositionBps', getU64Decoder()],
        ['maxPositionSizeUsd', getU64Decoder()],
        ['dovesOracle', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['jumpRateState', getJumpRateStateDecoder()],
        ['dovesAgOracle', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['priceImpactBuffer', getPriceImpactBufferDecoder()],
        ['borrowLendParameters', getBorrowLendParamsDecoder()],
        ['borrowsFundingRateState', getFundingRateStateDecoder()],
        ['debt', getU128Decoder()],
        ['borrowLendInterestsAccured', getU128Decoder()],
        ['borrowLimitInTokenAmount', getU64Decoder()],
        ['minInterestFeeBps', getU64Decoder()],
        ['minInterestFeeGracePeriodSeconds', getU64Decoder()],
        ['totalStakedAmountLamports', getU64Decoder()],
        ['maxTotalStakedAmountLamports', getU64Decoder()],
        ['externalSwapFeeMultiplierBps', getU64Decoder()],
        ['disableClosePositionRequest', getBooleanDecoder()],
        ['withdrawalLimitTokenAmount', getU64Decoder()],
        ['withdrawalTokenAmountAccumulated', getU64Decoder()],
        ['withdrawalLimitLastResetAt', getI64Decoder()],
        ['withdrawalLimitIntervalSeconds', getU64Decoder()],
    ]);
}

export function deserializeCustodyAccount(data: Uint8Array): CustodyAccountData {
    const deserialized = getCustodyAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as CustodyAccountData;
}

export async function fetchCustodyAccount(connection: Connection, address: Address): Promise<CustodyAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Custody account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeCustodyAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeCustodyAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(CustodyAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeCustodyAccount(accountInfo.data),
        };
    });
}

export async function fetchAllCustodyAccounts(connection: Connection, addresses: Address[]): Promise<CustodyAccount[]> {
    const maybeAccounts = await fetchAllMaybeCustodyAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Custody account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is CustodyAccount => a !== null);
}

export async function fetchProgramAccountsCustody(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<CustodyAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'HgWVUrv1XE' } }, { dataSize: 1117 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeCustodyAccount(account.data),
    }));
}
