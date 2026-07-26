import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, getU8Codec, transformCodec } from '@solana/codecs';

export interface RateModelAccountData {
    mint: Address;
    version: number;
    rateAtZero: number;
    kink1Utilization: number;
    rateAtKink1: number;
    rateAtMax: number;
    kink2Utilization: number;
    rateAtKink2: number;
}

export interface RateModelAccount {
    address: Address;
    data: RateModelAccountData;
}

const RateModelAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['version', getU8Codec()],
    ['rateAtZero', getU16Codec()],
    ['kink1Utilization', getU16Codec()],
    ['rateAtKink1', getU16Codec()],
    ['rateAtMax', getU16Codec()],
    ['kink2Utilization', getU16Codec()],
    ['rateAtKink2', getU16Codec()],
]);

export function deserializeRateModelAccount(data: Uint8Array): RateModelAccountData {
    const deserialized = RateModelAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as RateModelAccountData;
}

export async function fetchRateModelAccount(connection: Connection, address: Address): Promise<RateModelAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('RateModel account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeRateModelAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeRateModelAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(RateModelAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeRateModelAccount(accountInfo.data),
        };
    });
}

export async function fetchAllRateModelAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<RateModelAccount[]> {
    const maybeAccounts = await fetchAllMaybeRateModelAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('RateModel account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is RateModelAccount => a !== null);
}

export async function fetchProgramAccountsRateModel(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<RateModelAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'Gj4aGMVQEWd' } }, { dataSize: 53 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeRateModelAccount(account.data),
    }));
}
