import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { PeriodLimit, periodLimitCodec } from '../types/periodLimit';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface ConfigAccountData {
    mint: Address;
    authority: Address;
    tokenProgram: Address;
    periodLimits: Array<PeriodLimit>;
    pegPriceUsd: bigint;
    decimals: number;
    isMintRedeemEnabled: number;
    authorityBump: number;
    configBump: number;
    padding: Uint8Array;
    reserved: Uint8Array;
}

export interface ConfigAccount {
    address: Address;
    data: ConfigAccountData;
}

const ConfigAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'tokenProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['periodLimits', getArrayCodec(periodLimitCodec, { size: 4 })],
    ['pegPriceUsd', getU64Codec()],
    ['decimals', getU8Codec()],
    ['isMintRedeemEnabled', getU8Codec()],
    ['authorityBump', getU8Codec()],
    ['configBump', getU8Codec()],
    ['padding', fixCodecSize(getBytesCodec(), 4)],
    ['reserved', fixCodecSize(getBytesCodec(), 192)],
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
        filters: [...[{ memcmp: { offset: 0, bytes: 'SwB71qnXfS1' } }, { dataSize: 504 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeConfigAccount(account.data),
    }));
}
