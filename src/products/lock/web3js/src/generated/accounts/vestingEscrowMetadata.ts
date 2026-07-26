import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';

export interface VestingEscrowMetadataAccountData {
    escrow: Address;
    name: string;
    description: string;
    creatorEmail: string;
    recipientEmail: string;
}

export interface VestingEscrowMetadataAccount {
    address: Address;
    data: VestingEscrowMetadataAccountData;
}

const VestingEscrowMetadataAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'escrow',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['name', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['description', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['creatorEmail', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['recipientEmail', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
]);

export function deserializeVestingEscrowMetadataAccount(data: Uint8Array): VestingEscrowMetadataAccountData {
    const deserialized = VestingEscrowMetadataAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VestingEscrowMetadataAccountData;
}

export async function fetchVestingEscrowMetadataAccount(
    connection: Connection,
    address: Address,
): Promise<VestingEscrowMetadataAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('VestingEscrowMetadata account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVestingEscrowMetadataAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVestingEscrowMetadataAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VestingEscrowMetadataAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVestingEscrowMetadataAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVestingEscrowMetadataAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<VestingEscrowMetadataAccount[]> {
    const maybeAccounts = await fetchAllMaybeVestingEscrowMetadataAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('VestingEscrowMetadata account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VestingEscrowMetadataAccount => a !== null);
}

export async function fetchProgramAccountsVestingEscrowMetadata(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VestingEscrowMetadataAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '59axEA9Qcap' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVestingEscrowMetadataAccount(account.data),
    }));
}
