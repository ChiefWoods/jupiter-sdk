import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU128Decoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type DexAccountData = {
    dexId: number;
    reEntrancy: number;
    token0: Address;
    token1: Address;
    token0Decimals: number;
    token1Decimals: number;
    lastToLastStoredPrice: bigint;
    lastStoredPrice: bigint;
    centerPrice: bigint;
    lastUpdateTimestamp: bigint;
    lastUpdateSlot: bigint;
    isSmartCollateralEnabled: number;
    isSmartDebtEnabled: number;
    fee: number;
    revenueCut: number;
    percentChangeActive: number;
    upperPercent: number;
    lowerPercent: number;
    thresholdChangeActive: number;
    upperShiftThresholdPercent: number;
    lowerShiftThresholdPercent: number;
    shiftingTime: number;
    centerPriceAddress: Address;
    maxCenterPrice: bigint;
    minCenterPrice: bigint;
    token0MaxUtilization: number;
    token1MaxUtilization: number;
    isCenterPriceShiftActive: number;
    swapAndArbitragePaused: number;
    totalSupplyShares: bigint;
    maxSupplyShares: bigint;
    totalBorrowShares: bigint;
    maxBorrowShares: bigint;
    rangeOldUpperShift: number;
    rangeOldLowerShift: number;
    rangeShiftDuration: number;
    rangeShiftStartTimestamp: number;
    thresholdOldUpperShift: number;
    thresholdOldLowerShift: number;
    thresholdShiftDuration: number;
    thresholdShiftStartTimestamp: number;
    thresholdShiftOldTimestamp: number;
    centerPriceShiftStartTimestamp: number;
    centerPriceShiftPercent: number;
    centerPriceShiftTime: number;
    reserved: ReadonlyUint8Array;
    bump: number;
};

export interface DexAccount {
    address: Address;
    data: DexAccountData;
}

function getDexAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    dexId: number;
    reEntrancy: number;
    token0: Address;
    token1: Address;
    token0Decimals: number;
    token1Decimals: number;
    lastToLastStoredPrice: bigint;
    lastStoredPrice: bigint;
    centerPrice: bigint;
    lastUpdateTimestamp: bigint;
    lastUpdateSlot: bigint;
    isSmartCollateralEnabled: number;
    isSmartDebtEnabled: number;
    fee: number;
    revenueCut: number;
    percentChangeActive: number;
    upperPercent: number;
    lowerPercent: number;
    thresholdChangeActive: number;
    upperShiftThresholdPercent: number;
    lowerShiftThresholdPercent: number;
    shiftingTime: number;
    centerPriceAddress: Address;
    maxCenterPrice: bigint;
    minCenterPrice: bigint;
    token0MaxUtilization: number;
    token1MaxUtilization: number;
    isCenterPriceShiftActive: number;
    swapAndArbitragePaused: number;
    totalSupplyShares: bigint;
    maxSupplyShares: bigint;
    totalBorrowShares: bigint;
    maxBorrowShares: bigint;
    rangeOldUpperShift: number;
    rangeOldLowerShift: number;
    rangeShiftDuration: number;
    rangeShiftStartTimestamp: number;
    thresholdOldUpperShift: number;
    thresholdOldLowerShift: number;
    thresholdShiftDuration: number;
    thresholdShiftStartTimestamp: number;
    thresholdShiftOldTimestamp: number;
    centerPriceShiftStartTimestamp: number;
    centerPriceShiftPercent: number;
    centerPriceShiftTime: number;
    reserved: ReadonlyUint8Array;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['dexId', getU16Decoder()],
        ['reEntrancy', getU8Decoder()],
        ['token0', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['token1', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['token0Decimals', getU8Decoder()],
        ['token1Decimals', getU8Decoder()],
        ['lastToLastStoredPrice', getU128Decoder()],
        ['lastStoredPrice', getU128Decoder()],
        ['centerPrice', getU128Decoder()],
        ['lastUpdateTimestamp', getU64Decoder()],
        ['lastUpdateSlot', getU64Decoder()],
        ['isSmartCollateralEnabled', getU8Decoder()],
        ['isSmartDebtEnabled', getU8Decoder()],
        ['fee', getU32Decoder()],
        ['revenueCut', getU8Decoder()],
        ['percentChangeActive', getU8Decoder()],
        ['upperPercent', getU32Decoder()],
        ['lowerPercent', getU32Decoder()],
        ['thresholdChangeActive', getU8Decoder()],
        ['upperShiftThresholdPercent', getU16Decoder()],
        ['lowerShiftThresholdPercent', getU16Decoder()],
        ['shiftingTime', getU32Decoder()],
        ['centerPriceAddress', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['maxCenterPrice', getU64Decoder()],
        ['minCenterPrice', getU64Decoder()],
        ['token0MaxUtilization', getU16Decoder()],
        ['token1MaxUtilization', getU16Decoder()],
        ['isCenterPriceShiftActive', getU8Decoder()],
        ['swapAndArbitragePaused', getU8Decoder()],
        ['totalSupplyShares', getU64Decoder()],
        ['maxSupplyShares', getU64Decoder()],
        ['totalBorrowShares', getU64Decoder()],
        ['maxBorrowShares', getU64Decoder()],
        ['rangeOldUpperShift', getU32Decoder()],
        ['rangeOldLowerShift', getU32Decoder()],
        ['rangeShiftDuration', getU32Decoder()],
        ['rangeShiftStartTimestamp', getU32Decoder()],
        ['thresholdOldUpperShift', getU16Decoder()],
        ['thresholdOldLowerShift', getU16Decoder()],
        ['thresholdShiftDuration', getU32Decoder()],
        ['thresholdShiftStartTimestamp', getU32Decoder()],
        ['thresholdShiftOldTimestamp', getU32Decoder()],
        ['centerPriceShiftStartTimestamp', getU32Decoder()],
        ['centerPriceShiftPercent', getU32Decoder()],
        ['centerPriceShiftTime', getU32Decoder()],
        ['reserved', fixDecoderSize(getBytesDecoder(), 32)],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeDexAccount(data: Uint8Array): DexAccountData {
    const deserialized = getDexAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as DexAccountData;
}

export async function fetchDexAccount(connection: Connection, address: Address): Promise<DexAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Dex account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeDexAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeDexAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(DexAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeDexAccount(accountInfo.data),
        };
    });
}

export async function fetchAllDexAccounts(connection: Connection, addresses: Address[]): Promise<DexAccount[]> {
    const maybeAccounts = await fetchAllMaybeDexAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Dex account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is DexAccount => a !== null);
}

export async function fetchProgramAccountsDex(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<DexAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'gVfEzRwqm4e' } }, { dataSize: 329 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeDexAccount(account.data),
    }));
}
