import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getArrayDecoder,
    getBooleanDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU128Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getFeesDecoder, type Fees } from '../types/fees';
import { getLimitDecoder, type Limit } from '../types/limit';
import { getPoolAprDecoder, type PoolApr } from '../types/poolApr';
import { getSecp256k1PubkeyDecoder, type Secp256k1Pubkey } from '../types/secp256k1Pubkey';

export const POOL_ACCOUNT_DISCRIMINATOR = new Uint8Array([241, 154, 109, 4, 17, 177, 109, 188]);

export type PoolAccountData = {
    name: string;
    custodies: Array<Address>;
    aumUsd: bigint;
    limit: Limit;
    fees: Fees;
    poolApr: PoolApr;
    maxRequestExecutionSec: bigint;
    bump: number;
    lpTokenBump: number;
    inceptionTime: bigint;
    parameterUpdateOracle: Secp256k1Pubkey;
    aumUsdUpdatedAt: bigint;
    maxTriggerPriceDiffBps: bigint;
    disableClosePositionRequest: boolean;
    maxLpTokenPriceChangeBps: bigint;
    aumUsdRefreshedAtSlot: bigint;
};

export interface PoolAccount {
    address: Address;
    data: PoolAccountData;
}

function getPoolAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    name: string;
    custodies: Array<Address>;
    aumUsd: bigint;
    limit: Limit;
    fees: Fees;
    poolApr: PoolApr;
    maxRequestExecutionSec: bigint;
    bump: number;
    lpTokenBump: number;
    inceptionTime: bigint;
    parameterUpdateOracle: Secp256k1Pubkey;
    aumUsdUpdatedAt: bigint;
    maxTriggerPriceDiffBps: bigint;
    disableClosePositionRequest: boolean;
    maxLpTokenPriceChangeBps: bigint;
    aumUsdRefreshedAtSlot: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        [
            'custodies',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['aumUsd', getU128Decoder()],
        ['limit', getLimitDecoder()],
        ['fees', getFeesDecoder()],
        ['poolApr', getPoolAprDecoder()],
        ['maxRequestExecutionSec', getI64Decoder()],
        ['bump', getU8Decoder()],
        ['lpTokenBump', getU8Decoder()],
        ['inceptionTime', getI64Decoder()],
        ['parameterUpdateOracle', getSecp256k1PubkeyDecoder()],
        ['aumUsdUpdatedAt', getI64Decoder()],
        ['maxTriggerPriceDiffBps', getU64Decoder()],
        ['disableClosePositionRequest', getBooleanDecoder()],
        ['maxLpTokenPriceChangeBps', getU64Decoder()],
        ['aumUsdRefreshedAtSlot', getU64Decoder()],
    ]);
}

export function deserializePoolAccount(data: Uint8Array): PoolAccountData {
    if (!POOL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('POOLACCOUNT discriminator mismatch');
    }
    const deserialized = getPoolAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as PoolAccountData;
}

export async function fetchPoolAccount(connection: Connection, address: Address): Promise<PoolAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Pool account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializePoolAccount(accountInfo.data),
    };
}

export async function fetchAllMaybePoolAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(PoolAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializePoolAccount(accountInfo.data),
        };
    });
}

export async function fetchAllPoolAccounts(connection: Connection, addresses: Address[]): Promise<PoolAccount[]> {
    const maybeAccounts = await fetchAllMaybePoolAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Pool account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is PoolAccount => a !== null);
}

export async function fetchProgramAccountsPool(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<PoolAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'hQrXeCntzbV' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePoolAccount(account.data),
    }));
}
