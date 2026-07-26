import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU128Codec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface DexAccountData {
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
    reserved: Uint8Array;
    bump: number;
}

export interface DexAccount {
    address: Address;
    data: DexAccountData;
}

const DexAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['dexId', getU16Codec()],
    ['reEntrancy', getU8Codec()],
    [
        'token0',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'token1',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['token0Decimals', getU8Codec()],
    ['token1Decimals', getU8Codec()],
    ['lastToLastStoredPrice', getU128Codec()],
    ['lastStoredPrice', getU128Codec()],
    ['centerPrice', getU128Codec()],
    ['lastUpdateTimestamp', getU64Codec()],
    ['lastUpdateSlot', getU64Codec()],
    ['isSmartCollateralEnabled', getU8Codec()],
    ['isSmartDebtEnabled', getU8Codec()],
    ['fee', getU32Codec()],
    ['revenueCut', getU8Codec()],
    ['percentChangeActive', getU8Codec()],
    ['upperPercent', getU32Codec()],
    ['lowerPercent', getU32Codec()],
    ['thresholdChangeActive', getU8Codec()],
    ['upperShiftThresholdPercent', getU16Codec()],
    ['lowerShiftThresholdPercent', getU16Codec()],
    ['shiftingTime', getU32Codec()],
    [
        'centerPriceAddress',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['maxCenterPrice', getU64Codec()],
    ['minCenterPrice', getU64Codec()],
    ['token0MaxUtilization', getU16Codec()],
    ['token1MaxUtilization', getU16Codec()],
    ['isCenterPriceShiftActive', getU8Codec()],
    ['swapAndArbitragePaused', getU8Codec()],
    ['totalSupplyShares', getU64Codec()],
    ['maxSupplyShares', getU64Codec()],
    ['totalBorrowShares', getU64Codec()],
    ['maxBorrowShares', getU64Codec()],
    ['rangeOldUpperShift', getU32Codec()],
    ['rangeOldLowerShift', getU32Codec()],
    ['rangeShiftDuration', getU32Codec()],
    ['rangeShiftStartTimestamp', getU32Codec()],
    ['thresholdOldUpperShift', getU16Codec()],
    ['thresholdOldLowerShift', getU16Codec()],
    ['thresholdShiftDuration', getU32Codec()],
    ['thresholdShiftStartTimestamp', getU32Codec()],
    ['thresholdShiftOldTimestamp', getU32Codec()],
    ['centerPriceShiftStartTimestamp', getU32Codec()],
    ['centerPriceShiftPercent', getU32Codec()],
    ['centerPriceShiftTime', getU32Codec()],
    ['reserved', fixCodecSize(getBytesCodec(), 32)],
    ['bump', getU8Codec()],
]);

export function deserializeDexAccount(data: Uint8Array): DexAccountData {
    const deserialized = DexAccountDataCodec.decode(data);
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
