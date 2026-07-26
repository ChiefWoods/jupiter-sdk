import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface ConfigAccountData {
    admin: Address;
    feeAuthority: Address;
    configBump: number;
    feeAuthorityBump: number;
    padding: Uint8Array;
    interestFeeBps: number;
    repayFeeBps: number;
    liquidationFeeBps: number;
    referralRewardsFeeBps: number;
    refereeRewardsFeeBps: number;
    padding1: Uint8Array;
    minPrincipalAmount: bigint;
    minCollateralAmount: bigint;
    minDuration: number;
    minExpiry: number;
    maxApy: number;
    maxDuration: number;
    maxExpiry: number;
    isPaused: number;
    disableRepayment: number;
    padding2: Uint8Array;
    reserved: Uint8Array;
}

export interface ConfigAccount {
    address: Address;
    data: ConfigAccountData;
}

const ConfigAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'admin',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'feeAuthority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['configBump', getU8Codec()],
    ['feeAuthorityBump', getU8Codec()],
    ['padding', fixCodecSize(getBytesCodec(), 6)],
    ['interestFeeBps', getU16Codec()],
    ['repayFeeBps', getU16Codec()],
    ['liquidationFeeBps', getU16Codec()],
    ['referralRewardsFeeBps', getU16Codec()],
    ['refereeRewardsFeeBps', getU16Codec()],
    ['padding1', fixCodecSize(getBytesCodec(), 6)],
    ['minPrincipalAmount', getU64Codec()],
    ['minCollateralAmount', getU64Codec()],
    ['minDuration', getU32Codec()],
    ['minExpiry', getU32Codec()],
    ['maxApy', getU32Codec()],
    ['maxDuration', getU32Codec()],
    ['maxExpiry', getU32Codec()],
    ['isPaused', getU8Codec()],
    ['disableRepayment', getU8Codec()],
    ['padding2', fixCodecSize(getBytesCodec(), 2)],
    ['reserved', fixCodecSize(getBytesCodec(), 400)],
]);

export function deserializeConfigAccount(data: Uint8Array): ConfigAccountData {
    const deserialized = ConfigAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as ConfigAccountData;
}

export async function fetchConfigAccount(connection: Connection, address: Address): Promise<ConfigAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Config account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeConfigAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeConfigAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(ConfigAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeConfigAccount(accountInfo.data),
        };
    });
}

export async function fetchAllConfigAccounts(connection: Connection, addresses: Address[]): Promise<ConfigAccount[]> {
    const maybeAccounts = await fetchAllMaybeConfigAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Config account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is ConfigAccount => a !== null);
}

export async function fetchProgramAccountsConfig(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<ConfigAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'SwB71qnXfS1' } }, { dataSize: 536 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeConfigAccount(account.data),
    }));
}
