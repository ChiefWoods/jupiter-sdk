import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type VaultAdminAccountData = {
    authority: Address;
    liquidityProgram: Address;
    nextVaultId: number;
    auths: Array<Address>;
    bump: number;
};

export interface VaultAdminAccount {
    address: Address;
    data: VaultAdminAccountData;
}

function getVaultAdminAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    liquidityProgram: Address;
    nextVaultId: number;
    auths: Array<Address>;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['nextVaultId', getU16Decoder()],
        [
            'auths',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeVaultAdminAccount(data: Uint8Array): VaultAdminAccountData {
    const deserialized = getVaultAdminAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VaultAdminAccountData;
}

export async function fetchVaultAdminAccount(connection: Connection, address: Address): Promise<VaultAdminAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('VaultAdmin account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVaultAdminAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVaultAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VaultAdminAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVaultAdminAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVaultAdminAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<VaultAdminAccount[]> {
    const maybeAccounts = await fetchAllMaybeVaultAdminAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('VaultAdmin account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VaultAdminAccount => a !== null);
}

export async function fetchProgramAccountsVaultAdmin(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VaultAdminAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'FnQmjscaBxw' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVaultAdminAccount(account.data),
    }));
}
