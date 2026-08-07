import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getAssetDecoder, type Asset } from '../types/asset';
import { getAssetFilterDecoder, type AssetFilter } from '../types/assetFilter';
import { getOfferSideDecoder, type OfferSide } from '../types/offerSide';
import { getOfferStatusDecoder, type OfferStatus } from '../types/offerStatus';

export const OFFER_ACCOUNT_DISCRIMINATOR = new Uint8Array([215, 88, 60, 71, 170, 162, 73, 229]);

export type OfferAccountData = {
    creator: Address;
    side: OfferSide;
    status: OfferStatus;
    padding: ReadonlyUint8Array;
    principal: Asset;
    padding2: ReadonlyUint8Array;
    collateral: Asset;
    padding3: ReadonlyUint8Array;
    filter: AssetFilter;
    padding4: ReadonlyUint8Array;
    principalAmount: bigint;
    remainingPrincipal: bigint;
    collateralAmount: bigint;
    remainingCollateral: bigint;
    padding5: ReadonlyUint8Array;
    apy: number;
    duration: number;
    createdAt: bigint;
    expiredAt: bigint;
    updatedAt: bigint;
    minFillAmount: bigint;
    fillCounter: bigint;
    allowPartialFill: number;
    bump: number;
    padding6: ReadonlyUint8Array;
    counteredOffer: Address;
    reserved: ReadonlyUint8Array;
};

export interface OfferAccount {
    address: Address;
    data: OfferAccountData;
}

function getOfferAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    creator: Address;
    side: OfferSide;
    status: OfferStatus;
    padding: ReadonlyUint8Array;
    principal: Asset;
    padding2: ReadonlyUint8Array;
    collateral: Asset;
    padding3: ReadonlyUint8Array;
    filter: AssetFilter;
    padding4: ReadonlyUint8Array;
    principalAmount: bigint;
    remainingPrincipal: bigint;
    collateralAmount: bigint;
    remainingCollateral: bigint;
    padding5: ReadonlyUint8Array;
    apy: number;
    duration: number;
    createdAt: bigint;
    expiredAt: bigint;
    updatedAt: bigint;
    minFillAmount: bigint;
    fillCounter: bigint;
    allowPartialFill: number;
    bump: number;
    padding6: ReadonlyUint8Array;
    counteredOffer: Address;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['side', getOfferSideDecoder()],
        ['status', getOfferStatusDecoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 6)],
        ['principal', getAssetDecoder()],
        ['padding2', fixDecoderSize(getBytesDecoder(), 7)],
        ['collateral', getAssetDecoder()],
        ['padding3', fixDecoderSize(getBytesDecoder(), 7)],
        ['filter', getAssetFilterDecoder()],
        ['padding4', fixDecoderSize(getBytesDecoder(), 7)],
        ['principalAmount', getU64Decoder()],
        ['remainingPrincipal', getU64Decoder()],
        ['collateralAmount', getU64Decoder()],
        ['remainingCollateral', getU64Decoder()],
        ['padding5', fixDecoderSize(getBytesDecoder(), 8)],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['createdAt', getU64Decoder()],
        ['expiredAt', getU64Decoder()],
        ['updatedAt', getU64Decoder()],
        ['minFillAmount', getU64Decoder()],
        ['fillCounter', getU64Decoder()],
        ['allowPartialFill', getU8Decoder()],
        ['bump', getU8Decoder()],
        ['padding6', fixDecoderSize(getBytesDecoder(), 6)],
        ['counteredOffer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 232)],
    ]);
}

export function deserializeOfferAccount(data: Uint8Array): OfferAccountData {
    if (!OFFER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERACCOUNT discriminator mismatch');
    }
    const deserialized = getOfferAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as OfferAccountData;
}

export async function fetchOfferAccount(connection: Connection, address: Address): Promise<OfferAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Offer account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeOfferAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeOfferAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(OfferAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeOfferAccount(accountInfo.data),
        };
    });
}

export async function fetchAllOfferAccounts(connection: Connection, addresses: Address[]): Promise<OfferAccount[]> {
    const maybeAccounts = await fetchAllMaybeOfferAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Offer account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is OfferAccount => a !== null);
}

export async function fetchProgramAccountsOffer(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<OfferAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'd27ZJAf7ENY' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeOfferAccount(account.data),
    }));
}
