import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type Option,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getRequestChangeDecoder, type RequestChange } from '../types/requestChange';
import { getRequestTypeDecoder, type RequestType } from '../types/requestType';
import { getSideDecoder, type Side } from '../types/side';

export const POSITION_REQUEST_ACCOUNT_DISCRIMINATOR = new Uint8Array([12, 38, 250, 199, 46, 154, 32, 216]);

export type PositionRequestAccountData = {
    owner: Address;
    pool: Address;
    custody: Address;
    position: Address;
    mint: Address;
    openTime: bigint;
    updateTime: bigint;
    sizeUsdDelta: bigint;
    collateralDelta: bigint;
    requestChange: RequestChange;
    requestType: RequestType;
    side: Side;
    priceSlippage: Option<bigint>;
    jupiterMinimumOut: Option<bigint>;
    preSwapAmount: Option<bigint>;
    triggerPrice: Option<bigint>;
    triggerAboveThreshold: Option<boolean>;
    entirePosition: Option<boolean>;
    executed: boolean;
    counter: bigint;
    bump: number;
    referral: Option<Address>;
};

export interface PositionRequestAccount {
    address: Address;
    data: PositionRequestAccountData;
}

function getPositionRequestAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    owner: Address;
    pool: Address;
    custody: Address;
    position: Address;
    mint: Address;
    openTime: bigint;
    updateTime: bigint;
    sizeUsdDelta: bigint;
    collateralDelta: bigint;
    requestChange: RequestChange;
    requestType: RequestType;
    side: Side;
    priceSlippage: Option<bigint>;
    jupiterMinimumOut: Option<bigint>;
    preSwapAmount: Option<bigint>;
    triggerPrice: Option<bigint>;
    triggerAboveThreshold: Option<boolean>;
    entirePosition: Option<boolean>;
    executed: boolean;
    counter: bigint;
    bump: number;
    referral: Option<Address>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['position', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['openTime', getI64Decoder()],
        ['updateTime', getI64Decoder()],
        ['sizeUsdDelta', getU64Decoder()],
        ['collateralDelta', getU64Decoder()],
        ['requestChange', getRequestChangeDecoder()],
        ['requestType', getRequestTypeDecoder()],
        ['side', getSideDecoder()],
        ['priceSlippage', getOptionDecoder(getU64Decoder())],
        ['jupiterMinimumOut', getOptionDecoder(getU64Decoder())],
        ['preSwapAmount', getOptionDecoder(getU64Decoder())],
        ['triggerPrice', getOptionDecoder(getU64Decoder())],
        ['triggerAboveThreshold', getOptionDecoder(getBooleanDecoder())],
        ['entirePosition', getOptionDecoder(getBooleanDecoder())],
        ['executed', getBooleanDecoder()],
        ['counter', getU64Decoder()],
        ['bump', getU8Decoder()],
        [
            'referral',
            getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
    ]);
}

export function deserializePositionRequestAccount(data: Uint8Array): PositionRequestAccountData {
    if (!POSITION_REQUEST_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PositionRequestAccount discriminator mismatch');
    }
    const deserialized = getPositionRequestAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as PositionRequestAccountData;
}

export async function fetchPositionRequestAccount(
    connection: Connection,
    address: Address,
): Promise<PositionRequestAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('PositionRequest account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializePositionRequestAccount(accountInfo.data),
    };
}

export async function fetchAllMaybePositionRequestAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(PositionRequestAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializePositionRequestAccount(accountInfo.data),
        };
    });
}

export async function fetchAllPositionRequestAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<PositionRequestAccount[]> {
    const maybeAccounts = await fetchAllMaybePositionRequestAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('PositionRequest account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is PositionRequestAccount => a !== null);
}

export async function fetchProgramAccountsPositionRequest(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<PositionRequestAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '32tkJosYU3Z' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePositionRequestAccount(account.data),
    }));
}
