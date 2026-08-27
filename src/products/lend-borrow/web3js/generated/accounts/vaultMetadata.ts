import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const VAULT_METADATA_ACCOUNT_DISCRIMINATOR = new Uint8Array([248, 177, 244, 93, 67, 19, 117, 57]);

export type VaultMetadataAccountData = {
    vaultId: number;
    lookupTable: Address;
    supplyMintDecimals: number;
    borrowMintDecimals: number;
};

export interface VaultMetadataAccount {
    address: Address;
    data: VaultMetadataAccountData;
}

function getVaultMetadataAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    vaultId: number;
    lookupTable: Address;
    supplyMintDecimals: number;
    borrowMintDecimals: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['vaultId', getU16Decoder()],
        ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyMintDecimals', getU8Decoder()],
        ['borrowMintDecimals', getU8Decoder()],
    ]);
}

export function deserializeVaultMetadataAccount(data: Uint8Array): VaultMetadataAccountData {
    if (!VAULT_METADATA_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VaultMetadataAccount discriminator mismatch');
    }
    const deserialized = getVaultMetadataAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VaultMetadataAccountData;
}

export async function fetchVaultMetadataAccount(
    connection: Connection,
    address: Address,
): Promise<VaultMetadataAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('VaultMetadata account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVaultMetadataAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVaultMetadataAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VaultMetadataAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVaultMetadataAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVaultMetadataAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<VaultMetadataAccount[]> {
    const maybeAccounts = await fetchAllMaybeVaultMetadataAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('VaultMetadata account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VaultMetadataAccount => a !== null);
}

export async function fetchProgramAccountsVaultMetadata(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VaultMetadataAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'ibexC3fKvYG' } }, { dataSize: 44 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVaultMetadataAccount(account.data),
    }));
}
