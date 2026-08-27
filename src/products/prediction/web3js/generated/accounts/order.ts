import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type Option,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getOrderStatusDecoder, type OrderStatus } from '../types/orderStatus';
import { getOrderTypeDecoder, type OrderType } from '../types/orderType';

export const ORDER_ACCOUNT_DISCRIMINATOR = new Uint8Array([134, 173, 223, 185, 77, 86, 28, 51]);

export type OrderAccountData = {
    owner: Address;
    position: Address;
    status: OrderStatus;
    marketId: string;
    isYes: boolean;
    isBuy: boolean;
    createdAt: bigint;
    contracts: bigint;
    maxFillPriceUsd: bigint;
    filledAt: bigint;
    filledContracts: bigint;
    avgFillPriceUsd: bigint;
    orderId: Option<string>;
    externalOrderId: string;
    bump: number;
    orderType: OrderType;
    payer: Address;
    integrator: Address;
    integratorFeeBps: number;
    unitVersion: number;
};

export interface OrderAccount {
    address: Address;
    data: OrderAccountData;
}

function getOrderAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    owner: Address;
    position: Address;
    status: OrderStatus;
    marketId: string;
    isYes: boolean;
    isBuy: boolean;
    createdAt: bigint;
    contracts: bigint;
    maxFillPriceUsd: bigint;
    filledAt: bigint;
    filledContracts: bigint;
    avgFillPriceUsd: bigint;
    orderId: Option<string>;
    externalOrderId: string;
    bump: number;
    orderType: OrderType;
    payer: Address;
    integrator: Address;
    integratorFeeBps: number;
    unitVersion: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['position', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['status', getOrderStatusDecoder()],
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['isYes', getBooleanDecoder()],
        ['isBuy', getBooleanDecoder()],
        ['createdAt', getI64Decoder()],
        ['contracts', getU64Decoder()],
        ['maxFillPriceUsd', getU64Decoder()],
        ['filledAt', getI64Decoder()],
        ['filledContracts', getU64Decoder()],
        ['avgFillPriceUsd', getU64Decoder()],
        ['orderId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
        ['externalOrderId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['bump', getU8Decoder()],
        ['orderType', getOrderTypeDecoder()],
        ['payer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['integrator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['integratorFeeBps', getU16Decoder()],
        ['unitVersion', getU8Decoder()],
    ]);
}

export function deserializeOrderAccount(data: Uint8Array): OrderAccountData {
    if (!ORDER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OrderAccount discriminator mismatch');
    }
    const deserialized = getOrderAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as OrderAccountData;
}

export async function fetchOrderAccount(connection: Connection, address: Address): Promise<OrderAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Order account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeOrderAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeOrderAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(OrderAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeOrderAccount(accountInfo.data),
        };
    });
}

export async function fetchAllOrderAccounts(connection: Connection, addresses: Address[]): Promise<OrderAccount[]> {
    const maybeAccounts = await fetchAllMaybeOrderAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Order account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is OrderAccount => a !== null);
}

export async function fetchProgramAccountsOrder(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<OrderAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'PXZJQQ2HEmx' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeOrderAccount(account.data),
    }));
}
