import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type ConfigAccountData = {
    admin: Address;
    feeAuthority: Address;
    configBump: number;
    feeAuthorityBump: number;
    padding: ReadonlyUint8Array;
    interestFeeBps: number;
    repayFeeBps: number;
    liquidationFeeBps: number;
    referralRewardsFeeBps: number;
    refereeRewardsFeeBps: number;
    padding1: ReadonlyUint8Array;
    minPrincipalAmount: bigint;
    minCollateralAmount: bigint;
    minDuration: number;
    minExpiry: number;
    maxApy: number;
    maxDuration: number;
    maxExpiry: number;
    isPaused: number;
    disableRepayment: number;
    padding2: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
};

export interface ConfigAccount {
    address: Address;
    data: ConfigAccountData;
}

function getConfigAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    admin: Address;
    feeAuthority: Address;
    configBump: number;
    feeAuthorityBump: number;
    padding: ReadonlyUint8Array;
    interestFeeBps: number;
    repayFeeBps: number;
    liquidationFeeBps: number;
    referralRewardsFeeBps: number;
    refereeRewardsFeeBps: number;
    padding1: ReadonlyUint8Array;
    minPrincipalAmount: bigint;
    minCollateralAmount: bigint;
    minDuration: number;
    minExpiry: number;
    maxApy: number;
    maxDuration: number;
    maxExpiry: number;
    isPaused: number;
    disableRepayment: number;
    padding2: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['admin', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['feeAuthority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['configBump', getU8Decoder()],
        ['feeAuthorityBump', getU8Decoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 6)],
        ['interestFeeBps', getU16Decoder()],
        ['repayFeeBps', getU16Decoder()],
        ['liquidationFeeBps', getU16Decoder()],
        ['referralRewardsFeeBps', getU16Decoder()],
        ['refereeRewardsFeeBps', getU16Decoder()],
        ['padding1', fixDecoderSize(getBytesDecoder(), 6)],
        ['minPrincipalAmount', getU64Decoder()],
        ['minCollateralAmount', getU64Decoder()],
        ['minDuration', getU32Decoder()],
        ['minExpiry', getU32Decoder()],
        ['maxApy', getU32Decoder()],
        ['maxDuration', getU32Decoder()],
        ['maxExpiry', getU32Decoder()],
        ['isPaused', getU8Decoder()],
        ['disableRepayment', getU8Decoder()],
        ['padding2', fixDecoderSize(getBytesDecoder(), 2)],
        ['reserved', fixDecoderSize(getBytesDecoder(), 400)],
    ]);
}

export function deserializeConfigAccount(data: Uint8Array): ConfigAccountData {
    const deserialized = getConfigAccountDataDecoder().decode(data);
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
