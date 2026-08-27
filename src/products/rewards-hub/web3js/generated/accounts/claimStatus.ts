import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const CLAIM_STATUS_ACCOUNT_DISCRIMINATOR = new Uint8Array([22, 183, 249, 157, 247, 95, 150, 96]);

export type ClaimStatusAccountData = {
    /** Authority that claimed the tokens. */
    claimant: Address;
    /** Amount of tokens claimed by the claimant, per mission. */
    claimedAmounts: Array<bigint>;
    /** Amount of lootboxes claimed by the claimant, per mission. */
    claimedLootbox: Array<bigint>;
};

export interface ClaimStatusAccount {
    address: Address;
    data: ClaimStatusAccountData;
}

function getClaimStatusAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** Authority that claimed the tokens. */
    claimant: Address;
    /** Amount of tokens claimed by the claimant, per mission. */
    claimedAmounts: Array<bigint>;
    /** Amount of lootboxes claimed by the claimant, per mission. */
    claimedLootbox: Array<bigint>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['claimant', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['claimedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ['claimedLootbox', getArrayDecoder(getU64Decoder(), { size: 5 })],
    ]);
}

export function deserializeClaimStatusAccount(data: Uint8Array): ClaimStatusAccountData {
    if (!CLAIM_STATUS_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ClaimStatusAccount discriminator mismatch');
    }
    const deserialized = getClaimStatusAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as ClaimStatusAccountData;
}

export async function fetchClaimStatusAccount(connection: Connection, address: Address): Promise<ClaimStatusAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('ClaimStatus account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeClaimStatusAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeClaimStatusAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(ClaimStatusAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeClaimStatusAccount(accountInfo.data),
        };
    });
}

export async function fetchAllClaimStatusAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<ClaimStatusAccount[]> {
    const maybeAccounts = await fetchAllMaybeClaimStatusAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('ClaimStatus account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is ClaimStatusAccount => a !== null);
}

export async function fetchProgramAccountsClaimStatus(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<ClaimStatusAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '4oQAYYkWvcf' } }, { dataSize: 120 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeClaimStatusAccount(account.data),
    }));
}
