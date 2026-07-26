import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface LiquidityAccountData {
    authority: Address;
    revenueCollector: Address;
    status: boolean;
    bump: number;
}

export interface LiquidityAccount {
    address: Address;
    data: LiquidityAccountData;
}

const LiquidityAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'revenueCollector',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['status', getBooleanCodec()],
    ['bump', getU8Codec()],
]);

export function deserializeLiquidityAccount(data: Uint8Array): LiquidityAccountData {
    const deserialized = LiquidityAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as LiquidityAccountData;
}

export async function fetchLiquidityAccount(connection: Connection, address: Address): Promise<LiquidityAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Liquidity account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeLiquidityAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeLiquidityAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(LiquidityAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeLiquidityAccount(accountInfo.data),
        };
    });
}

export async function fetchAllLiquidityAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<LiquidityAccount[]> {
    const maybeAccounts = await fetchAllMaybeLiquidityAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Liquidity account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is LiquidityAccount => a !== null);
}

export async function fetchProgramAccountsLiquidity(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<LiquidityAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'ACTMHAmM5UD' } }, { dataSize: 74 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeLiquidityAccount(account.data),
    }));
}
