import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU32Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type VestingEscrowMetadataAccountData = {
    /** The [Escrow]. */
    escrow: Address;
    /** Name of escrow. */
    name: string;
    /** Description of escrow. */
    description: string;
    /** Email of creator */
    creatorEmail: string;
    /** Email of recipient */
    recipientEmail: string;
};

export interface VestingEscrowMetadataAccount {
    address: Address;
    data: VestingEscrowMetadataAccountData;
}

function getVestingEscrowMetadataAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** The [Escrow]. */
    escrow: Address;
    /** Name of escrow. */
    name: string;
    /** Description of escrow. */
    description: string;
    /** Email of creator */
    creatorEmail: string;
    /** Email of recipient */
    recipientEmail: string;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['escrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['description', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['creatorEmail', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['recipientEmail', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ]);
}

export function deserializeVestingEscrowMetadataAccount(data: Uint8Array): VestingEscrowMetadataAccountData {
    const deserialized = getVestingEscrowMetadataAccountDataDecoder().decode(data);
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
