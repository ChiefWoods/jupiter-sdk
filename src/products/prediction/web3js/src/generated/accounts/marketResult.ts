import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getI64Codec,
    getStructCodec,
    getU32Codec,
    getU8Codec,
    getUtf8Codec,
} from '@solana/codecs';

export interface MarketResultAccountData {
    marketId: string;
    outcome: number;
    settlementTime: bigint;
    claimsEnabled: boolean;
    createdAt: bigint;
    bump: number;
}

export interface MarketResultAccount {
    address: Address;
    data: MarketResultAccountData;
}

const MarketResultAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['outcome', getU8Codec()],
    ['settlementTime', getI64Codec()],
    ['claimsEnabled', getBooleanCodec()],
    ['createdAt', getI64Codec()],
    ['bump', getU8Codec()],
]);

export function deserializeMarketResultAccount(data: Uint8Array): MarketResultAccountData {
    const deserialized = MarketResultAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as MarketResultAccountData;
}

export async function fetchMarketResultAccount(connection: Connection, address: Address): Promise<MarketResultAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('MarketResult account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeMarketResultAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeMarketResultAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(MarketResultAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeMarketResultAccount(accountInfo.data),
        };
    });
}

export async function fetchAllMarketResultAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<MarketResultAccount[]> {
    const maybeAccounts = await fetchAllMaybeMarketResultAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('MarketResult account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is MarketResultAccount => a !== null);
}

export async function fetchProgramAccountsMarketResult(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<MarketResultAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'fDJyys8BJ53' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeMarketResultAccount(account.data),
    }));
}
