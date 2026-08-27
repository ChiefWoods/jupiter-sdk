import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getOptionDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type Option,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getKeyDecoder, type Key } from '../types/key';
import { getUpdateAuthorityDecoder, type UpdateAuthority } from '../types/updateAuthority';

export const BASE_ASSET_V1_ACCOUNT_DISCRIMINATOR = new Uint8Array([1]);

export type BaseAssetV1AccountData = {
    key: Key;
    owner: Address;
    updateAuthority: UpdateAuthority;
    name: string;
    uri: string;
    seq: Option<bigint>;
};

export interface BaseAssetV1Account {
    address: Address;
    data: BaseAssetV1AccountData;
}

function getBaseAssetV1AccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    key: Key;
    owner: Address;
    updateAuthority: UpdateAuthority;
    name: string;
    uri: string;
    seq: Option<bigint>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 1)],
        ['key', getKeyDecoder()],
        ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['updateAuthority', getUpdateAuthorityDecoder()],
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['uri', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['seq', getOptionDecoder(getU64Decoder())],
    ]);
}

export function deserializeBaseAssetV1Account(data: Uint8Array): BaseAssetV1AccountData {
    if (!BASE_ASSET_V1_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('BaseAssetV1Account discriminator mismatch');
    }
    const deserialized = getBaseAssetV1AccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as BaseAssetV1AccountData;
}

export async function fetchBaseAssetV1Account(connection: Connection, address: Address): Promise<BaseAssetV1Account> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('BaseAssetV1 account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeBaseAssetV1Account(accountInfo.data),
    };
}

export async function fetchAllMaybeBaseAssetV1Accounts(
    connection: Connection,
    addresses: Address[],
): Promise<(BaseAssetV1Account | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeBaseAssetV1Account(accountInfo.data),
        };
    });
}

export async function fetchAllBaseAssetV1Accounts(
    connection: Connection,
    addresses: Address[],
): Promise<BaseAssetV1Account[]> {
    const maybeAccounts = await fetchAllMaybeBaseAssetV1Accounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('BaseAssetV1 account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is BaseAssetV1Account => a !== null);
}

export async function fetchProgramAccountsBaseAssetV1(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<BaseAssetV1Account[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '2' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeBaseAssetV1Account(account.data),
    }));
}
