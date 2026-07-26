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

export interface UserSupplyPositionAccountData {
    protocol: Address;
    mint: Address;
    withInterest: number;
    amount: bigint;
    withdrawalLimit: bigint;
    decayAmount: bigint;
    lastUpdate: bigint;
    expandPct: number;
    expandDuration: number;
    decayDuration: number;
    baseWithdrawalLimit: bigint;
    status: number;
}

export interface UserSupplyPositionAccount {
    address: Address;
    data: UserSupplyPositionAccountData;
}

const UserSupplyPositionAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'protocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['withInterest', getU8Codec()],
    ['amount', getU64Codec()],
    ['withdrawalLimit', getU64Codec()],
    ['decayAmount', getU64Codec()],
    ['lastUpdate', getU64Codec()],
    ['expandPct', getU16Codec()],
    ['expandDuration', getU32Codec()],
    ['decayDuration', getU32Codec()],
    ['baseWithdrawalLimit', getU64Codec()],
    ['status', getU8Codec()],
]);

export function deserializeUserSupplyPositionAccount(data: Uint8Array): UserSupplyPositionAccountData {
    const deserialized = UserSupplyPositionAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as UserSupplyPositionAccountData;
}

export async function fetchUserSupplyPositionAccount(
    connection: Connection,
    address: Address,
): Promise<UserSupplyPositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('UserSupplyPosition account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeUserSupplyPositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeUserSupplyPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(UserSupplyPositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeUserSupplyPositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllUserSupplyPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<UserSupplyPositionAccount[]> {
    const maybeAccounts = await fetchAllMaybeUserSupplyPositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('UserSupplyPosition account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is UserSupplyPositionAccount => a !== null);
}

export async function fetchProgramAccountsUserSupplyPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<UserSupplyPositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'avyPzzqH6Lq' } }, { dataSize: 124 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeUserSupplyPositionAccount(account.data),
    }));
}
