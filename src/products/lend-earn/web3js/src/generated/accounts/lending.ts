import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface LendingAccountData {
    mint: Address;
    fTokenMint: Address;
    lendingId: number;
    decimals: number;
    rewardsRateModel: Address;
    liquidityExchangePrice: bigint;
    tokenExchangePrice: bigint;
    lastUpdateTimestamp: bigint;
    tokenReservesLiquidity: Address;
    supplyPositionOnLiquidity: Address;
    bump: number;
}

export interface LendingAccount {
    address: Address;
    data: LendingAccountData;
}

const LendingAccountDataCodec = getStructCodec([
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
        'fTokenMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['lendingId', getU16Codec()],
    ['decimals', getU8Codec()],
    [
        'rewardsRateModel',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['liquidityExchangePrice', getU64Codec()],
    ['tokenExchangePrice', getU64Codec()],
    ['lastUpdateTimestamp', getU64Codec()],
    [
        'tokenReservesLiquidity',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'supplyPositionOnLiquidity',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['bump', getU8Codec()],
]);

export function deserializeLendingAccount(data: Uint8Array): LendingAccountData {
    const deserialized = LendingAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as LendingAccountData;
}

export async function fetchLendingAccount(connection: Connection, address: Address): Promise<LendingAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Lending account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeLendingAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeLendingAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(LendingAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeLendingAccount(accountInfo.data),
        };
    });
}

export async function fetchAllLendingAccounts(connection: Connection, addresses: Address[]): Promise<LendingAccount[]> {
    const maybeAccounts = await fetchAllMaybeLendingAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Lending account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is LendingAccount => a !== null);
}

export async function fetchProgramAccountsLending(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<LendingAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'PiDuNSLmEPr' } }, { dataSize: 196 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeLendingAccount(account.data),
    }));
}
