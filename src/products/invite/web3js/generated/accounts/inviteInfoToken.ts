import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const INVITE_INFO_TOKEN_ACCOUNT_DISCRIMINATOR = new Uint8Array([234, 59, 141, 72, 7, 107, 253, 208]);

export type InviteInfoTokenAccountData = {
    sender: Address;
    inviteSigner: Address;
    escrowTokenAccount: Address;
    expiry: bigint;
    bump: number;
    padding: ReadonlyUint8Array;
};

export interface InviteInfoTokenAccount {
    address: Address;
    data: InviteInfoTokenAccountData;
}

function getInviteInfoTokenAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    sender: Address;
    inviteSigner: Address;
    escrowTokenAccount: Address;
    expiry: bigint;
    bump: number;
    padding: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['inviteSigner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['escrowTokenAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['expiry', getI64Decoder()],
        ['bump', getU8Decoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 7)],
    ]);
}

export function deserializeInviteInfoTokenAccount(data: Uint8Array): InviteInfoTokenAccountData {
    if (!INVITE_INFO_TOKEN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InviteInfoTokenAccount discriminator mismatch');
    }
    const deserialized = getInviteInfoTokenAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as InviteInfoTokenAccountData;
}

export async function fetchInviteInfoTokenAccount(
    connection: Connection,
    address: Address,
): Promise<InviteInfoTokenAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('InviteInfoToken account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeInviteInfoTokenAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeInviteInfoTokenAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(InviteInfoTokenAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeInviteInfoTokenAccount(accountInfo.data),
        };
    });
}

export async function fetchAllInviteInfoTokenAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<InviteInfoTokenAccount[]> {
    const maybeAccounts = await fetchAllMaybeInviteInfoTokenAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('InviteInfoToken account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is InviteInfoTokenAccount => a !== null);
}

export async function fetchProgramAccountsInviteInfoToken(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<InviteInfoTokenAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'gBMHxmkMfBd' } }, { dataSize: 120 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeInviteInfoTokenAccount(account.data),
    }));
}
