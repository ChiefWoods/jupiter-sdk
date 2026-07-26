import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getI64Codec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';

export interface PositionAccountData {
    owner: Address;
    marketId: string;
    isYes: boolean;
    payoutClaimed: boolean;
    payoutClaimedUsd: bigint;
    openedAt: bigint;
    contracts: bigint;
    totalCostUsd: bigint;
    openOrders: number;
    feesPaidUsd: bigint;
    realizedPnlUsd: bigint;
    updatedAt: bigint;
    bump: number;
    unitVersion: number;
    payer: Address;
}

export interface PositionAccount {
    address: Address;
    data: PositionAccountData;
}

const PositionAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'owner',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['isYes', getBooleanCodec()],
    ['payoutClaimed', getBooleanCodec()],
    ['payoutClaimedUsd', getU64Codec()],
    ['openedAt', getI64Codec()],
    ['contracts', getU64Codec()],
    ['totalCostUsd', getU64Codec()],
    ['openOrders', getU32Codec()],
    ['feesPaidUsd', getU64Codec()],
    ['realizedPnlUsd', getI64Codec()],
    ['updatedAt', getI64Codec()],
    ['bump', getU8Codec()],
    ['unitVersion', getU8Codec()],
    [
        'payer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function deserializePositionAccount(data: Uint8Array): PositionAccountData {
    const deserialized = PositionAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as PositionAccountData;
}

export async function fetchPositionAccount(connection: Connection, address: Address): Promise<PositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Position account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializePositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybePositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(PositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializePositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<PositionAccount[]> {
    const maybeAccounts = await fetchAllMaybePositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Position account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is PositionAccount => a !== null);
}

export async function fetchProgramAccountsPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<PositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'VZMoMoKgZQb' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePositionAccount(account.data),
    }));
}
