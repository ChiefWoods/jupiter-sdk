import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const LENDING_ACCOUNT_DISCRIMINATOR = new Uint8Array([135, 199, 82, 16, 249, 131, 182, 241]);

export type LendingAccountData = {
    mint: Address;
    fTokenMint: Address;
    lendingId: number;
    /** @dev number of decimals for the fToken, same as ASSET */
    decimals: number;
    /** @dev To read PDA of rewards rate model to get_rate instruction */
    rewardsRateModel: Address;
    /** @dev exchange price for the underlying asset in the liquidity protocol (without rewards) */
    liquidityExchangePrice: bigint;
    /** @dev exchange price between fToken and the underlying asset (with rewards) */
    tokenExchangePrice: bigint;
    /** @dev timestamp when exchange prices were updated the last time */
    lastUpdateTimestamp: bigint;
    tokenReservesLiquidity: Address;
    supplyPositionOnLiquidity: Address;
    bump: number;
};

export interface LendingAccount {
    address: Address;
    data: LendingAccountData;
}

function getLendingAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    mint: Address;
    fTokenMint: Address;
    lendingId: number;
    /** @dev number of decimals for the fToken, same as ASSET */
    decimals: number;
    /** @dev To read PDA of rewards rate model to get_rate instruction */
    rewardsRateModel: Address;
    /** @dev exchange price for the underlying asset in the liquidity protocol (without rewards) */
    liquidityExchangePrice: bigint;
    /** @dev exchange price between fToken and the underlying asset (with rewards) */
    tokenExchangePrice: bigint;
    /** @dev timestamp when exchange prices were updated the last time */
    lastUpdateTimestamp: bigint;
    tokenReservesLiquidity: Address;
    supplyPositionOnLiquidity: Address;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['fTokenMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['lendingId', getU16Decoder()],
        ['decimals', getU8Decoder()],
        ['rewardsRateModel', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityExchangePrice', getU64Decoder()],
        ['tokenExchangePrice', getU64Decoder()],
        ['lastUpdateTimestamp', getU64Decoder()],
        [
            'tokenReservesLiquidity',
            transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
        ],
        [
            'supplyPositionOnLiquidity',
            transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
        ],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeLendingAccount(data: Uint8Array): LendingAccountData {
    if (!LENDING_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LENDINGACCOUNT discriminator mismatch');
    }
    const deserialized = getLendingAccountDataDecoder().decode(data);
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
