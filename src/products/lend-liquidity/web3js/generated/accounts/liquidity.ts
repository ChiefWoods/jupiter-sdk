import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const LIQUIDITY_ACCOUNT_DISCRIMINATOR = new Uint8Array([54, 252, 249, 226, 137, 172, 121, 58]);

export type LiquidityAccountData = { authority: Address; revenueCollector: Address; status: boolean; bump: number };

export interface LiquidityAccount {
    address: Address;
    data: LiquidityAccountData;
}

function getLiquidityAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    revenueCollector: Address;
    status: boolean;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['revenueCollector', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['status', getBooleanDecoder()],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeLiquidityAccount(data: Uint8Array): LiquidityAccountData {
    if (!LIQUIDITY_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LiquidityAccount discriminator mismatch');
    }
    const deserialized = getLiquidityAccountDataDecoder().decode(data);
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
