import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, getU8Codec, transformCodec } from '@solana/codecs';

export interface VaultMetadataAccountData {
    vaultId: number;
    lookupTable: Address;
    supplyMintDecimals: number;
    borrowMintDecimals: number;
}

export interface VaultMetadataAccount {
    address: Address;
    data: VaultMetadataAccountData;
}

const VaultMetadataAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    [
        'lookupTable',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['supplyMintDecimals', getU8Codec()],
    ['borrowMintDecimals', getU8Codec()],
]);

export function deserializeVaultMetadataAccount(data: Uint8Array): VaultMetadataAccountData {
    const deserialized = VaultMetadataAccountDataCodec.decode(data);
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
