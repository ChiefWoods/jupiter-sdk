import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { Asset, assetCodec } from '../types/asset';
import { AssetFilter, assetFilterCodec } from '../types/assetFilter';
import { OfferSide, offerSideCodec } from '../types/offerSide';
import { OfferStatus, offerStatusCodec } from '../types/offerStatus';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface OfferAccountData {
    creator: Address;
    side: OfferSide;
    status: OfferStatus;
    padding: Uint8Array;
    principal: Asset;
    padding2: Uint8Array;
    collateral: Asset;
    padding3: Uint8Array;
    filter: AssetFilter;
    padding4: Uint8Array;
    principalAmount: bigint;
    remainingPrincipal: bigint;
    collateralAmount: bigint;
    remainingCollateral: bigint;
    padding5: Uint8Array;
    apy: number;
    duration: number;
    createdAt: bigint;
    expiredAt: bigint;
    updatedAt: bigint;
    minFillAmount: bigint;
    fillCounter: bigint;
    allowPartialFill: number;
    bump: number;
    padding6: Uint8Array;
    counteredOffer: Address;
    reserved: Uint8Array;
}

export interface OfferAccount {
    address: Address;
    data: OfferAccountData;
}

const OfferAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['side', offerSideCodec],
    ['status', offerStatusCodec],
    ['padding', fixCodecSize(getBytesCodec(), 6)],
    ['principal', assetCodec],
    ['padding2', fixCodecSize(getBytesCodec(), 7)],
    ['collateral', assetCodec],
    ['padding3', fixCodecSize(getBytesCodec(), 7)],
    ['filter', assetFilterCodec],
    ['padding4', fixCodecSize(getBytesCodec(), 7)],
    ['principalAmount', getU64Codec()],
    ['remainingPrincipal', getU64Codec()],
    ['collateralAmount', getU64Codec()],
    ['remainingCollateral', getU64Codec()],
    ['padding5', fixCodecSize(getBytesCodec(), 8)],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['createdAt', getU64Codec()],
    ['expiredAt', getU64Codec()],
    ['updatedAt', getU64Codec()],
    ['minFillAmount', getU64Codec()],
    ['fillCounter', getU64Codec()],
    ['allowPartialFill', getU8Codec()],
    ['bump', getU8Codec()],
    ['padding6', fixCodecSize(getBytesCodec(), 6)],
    [
        'counteredOffer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved', fixCodecSize(getBytesCodec(), 232)],
]);

export function deserializeOfferAccount(data: Uint8Array): OfferAccountData {
    const deserialized = OfferAccountDataCodec.decode(data);
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
