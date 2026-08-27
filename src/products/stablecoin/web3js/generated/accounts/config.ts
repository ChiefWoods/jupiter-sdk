import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getPeriodLimitDecoder, type PeriodLimit } from '../types/periodLimit';

export const CONFIG_ACCOUNT_DISCRIMINATOR = new Uint8Array([155, 12, 170, 224, 30, 250, 204, 130]);

export type ConfigAccountData = {
    mint: Address;
    authority: Address;
    tokenProgram: Address;
    periodLimits: Array<PeriodLimit>;
    pegPriceUsd: bigint;
    decimals: number;
    isMintRedeemEnabled: number;
    authorityBump: number;
    configBump: number;
    padding: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
};

export interface ConfigAccount {
    address: Address;
    data: ConfigAccountData;
}

function getConfigAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    mint: Address;
    authority: Address;
    tokenProgram: Address;
    periodLimits: Array<PeriodLimit>;
    pegPriceUsd: bigint;
    decimals: number;
    isMintRedeemEnabled: number;
    authorityBump: number;
    configBump: number;
    padding: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['periodLimits', getArrayDecoder(getPeriodLimitDecoder(), { size: 4 })],
        ['pegPriceUsd', getU64Decoder()],
        ['decimals', getU8Decoder()],
        ['isMintRedeemEnabled', getU8Decoder()],
        ['authorityBump', getU8Decoder()],
        ['configBump', getU8Decoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 4)],
        ['reserved', fixDecoderSize(getBytesDecoder(), 192)],
    ]);
}

export function deserializeConfigAccount(data: Uint8Array): ConfigAccountData {
    if (!CONFIG_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ConfigAccount discriminator mismatch');
    }
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
        filters: [...[{ memcmp: { offset: 0, bytes: 'SwB71qnXfS1' } }, { dataSize: 504 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeConfigAccount(account.data),
    }));
}
