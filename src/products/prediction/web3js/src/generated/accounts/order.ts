import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { OrderStatus, orderStatusCodec } from '../types/orderStatus';
import { OrderType, orderTypeCodec } from '../types/orderType';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getI64Codec,
    getOptionCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';

export interface OrderAccountData {
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
    orderId: string | null;
    externalOrderId: string;
    bump: number;
    orderType: OrderType;
    payer: Address;
    integrator: Address;
    integratorFeeBps: number;
    unitVersion: number;
}

export interface OrderAccount {
    address: Address;
    data: OrderAccountData;
}

const OrderAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'owner',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'position',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['status', orderStatusCodec],
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['isYes', getBooleanCodec()],
    ['isBuy', getBooleanCodec()],
    ['createdAt', getI64Codec()],
    ['contracts', getU64Codec()],
    ['maxFillPriceUsd', getU64Codec()],
    ['filledAt', getI64Codec()],
    ['filledContracts', getU64Codec()],
    ['avgFillPriceUsd', getU64Codec()],
    ['orderId', getOptionCodec(addCodecSizePrefix(getUtf8Codec(), getU32Codec()))],
    ['externalOrderId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['bump', getU8Codec()],
    ['orderType', orderTypeCodec],
    [
        'payer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'integrator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['integratorFeeBps', getU16Codec()],
    ['unitVersion', getU8Codec()],
]);

export function deserializeOrderAccount(data: Uint8Array): OrderAccountData {
    const deserialized = OrderAccountDataCodec.decode(data);
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
