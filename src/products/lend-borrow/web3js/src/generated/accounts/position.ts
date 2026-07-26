import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getI32Codec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface PositionAccountData {
    vaultId: number;
    nftId: number;
    positionMint: Address;
    isSupplyOnlyPosition: number;
    tick: number;
    tickId: number;
    supplyAmount: bigint;
    dustDebtAmount: bigint;
}

export interface PositionAccount {
    address: Address;
    data: PositionAccountData;
}

const PositionAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['nftId', getU32Codec()],
    [
        'positionMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['isSupplyOnlyPosition', getU8Codec()],
    ['tick', getI32Codec()],
    ['tickId', getU32Codec()],
    ['supplyAmount', getU64Codec()],
    ['dustDebtAmount', getU64Codec()],
]);

export function deserializePositionAccount(data: Uint8Array): PositionAccountData {
    const deserialized = PositionAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as PositionAccountData;
}

export async function fetchPositionAccount(connection: Connection, address: Address): Promise<PositionAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Position account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializePositionAccount(accountInfo.data),
    };
}

export async function fetchAllMaybePositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(PositionAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializePositionAccount(accountInfo.data),
        };
    });
}

export async function fetchAllPositionAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<PositionAccount[]> {
    const maybeAccounts = await fetchAllMaybePositionAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Position account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is PositionAccount => a !== null);
}

export async function fetchProgramAccountsPosition(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<PositionAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'VZMoMoKgZQb' } }, { dataSize: 71 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializePositionAccount(account.data),
    }));
}
