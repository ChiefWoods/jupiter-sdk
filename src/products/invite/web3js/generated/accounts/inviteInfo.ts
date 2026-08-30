import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const INVITE_INFO_ACCOUNT_DISCRIMINATOR = new Uint8Array([221, 16, 207, 116, 22, 143, 244, 211]);

export type InviteInfoAccountData = { sender: Address; expiry: bigint };

export interface InviteInfoAccount {
    address: Address;
    data: InviteInfoAccountData;
}

function getInviteInfoAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    sender: Address;
    expiry: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['expiry', getI64Decoder()],
    ]);
}

export function deserializeInviteInfoAccount(data: Uint8Array): InviteInfoAccountData {
    if (!INVITE_INFO_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InviteInfoAccount discriminator mismatch');
    }
    const deserialized = getInviteInfoAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as InviteInfoAccountData;
}

export async function fetchInviteInfoAccount(connection: Connection, address: Address): Promise<InviteInfoAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('InviteInfo account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeInviteInfoAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeInviteInfoAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(InviteInfoAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeInviteInfoAccount(accountInfo.data),
        };
    });
}

export async function fetchAllInviteInfoAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<InviteInfoAccount[]> {
    const maybeAccounts = await fetchAllMaybeInviteInfoAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('InviteInfo account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is InviteInfoAccount => a !== null);
}

export async function fetchProgramAccountsInviteInfo(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<InviteInfoAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'dycc54FNE7U' } }, { dataSize: 48 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeInviteInfoAccount(account.data),
    }));
}
