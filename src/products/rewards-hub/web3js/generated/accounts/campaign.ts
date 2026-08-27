import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const CAMPAIGN_ACCOUNT_DISCRIMINATOR = new Uint8Array([50, 40, 49, 11, 157, 220, 229, 192]);

export type CampaignAccountData = {
    /** Bump seed. */
    bump: number;
    /** The campaign id. */
    campaignId: string;
    /** The [Pubkey] to check against when checking the signature of the claims message. */
    claimsPubkey: Address;
    /** [Mint] of the token to be distributed. */
    mint: Address;
    /** base key of campaign. */
    base: Address;
    /** Token Address of the vault */
    tokenVault: Address;
    /** Maximum number of tokens that can ever be claimed from this [Campaign] by mission level. */
    allocatedAmounts: Array<bigint>;
    /** Total amount of tokens that have been claimed. */
    unclaimedAmounts: Array<bigint>;
    /** Number of nodes that have been claimed. */
    numClaimed: bigint;
    /** Lockup time start (Unix Timestamp) */
    startTs: bigint;
    /** Lockup time end (Unix Timestamp) */
    endTs: bigint;
    /** Clawback receiver */
    clawbackReceiver: Address;
    /** Admin wallet */
    admin: Address;
};

export interface CampaignAccount {
    address: Address;
    data: CampaignAccountData;
}

function getCampaignAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** Bump seed. */
    bump: number;
    /** The campaign id. */
    campaignId: string;
    /** The [Pubkey] to check against when checking the signature of the claims message. */
    claimsPubkey: Address;
    /** [Mint] of the token to be distributed. */
    mint: Address;
    /** base key of campaign. */
    base: Address;
    /** Token Address of the vault */
    tokenVault: Address;
    /** Maximum number of tokens that can ever be claimed from this [Campaign] by mission level. */
    allocatedAmounts: Array<bigint>;
    /** Total amount of tokens that have been claimed. */
    unclaimedAmounts: Array<bigint>;
    /** Number of nodes that have been claimed. */
    numClaimed: bigint;
    /** Lockup time start (Unix Timestamp) */
    startTs: bigint;
    /** Lockup time end (Unix Timestamp) */
    endTs: bigint;
    /** Clawback receiver */
    clawbackReceiver: Address;
    /** Admin wallet */
    admin: Address;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['bump', getU8Decoder()],
        ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['claimsPubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['tokenVault', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['allocatedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ['unclaimedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ['numClaimed', getU64Decoder()],
        ['startTs', getI64Decoder()],
        ['endTs', getI64Decoder()],
        ['clawbackReceiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['admin', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export function deserializeCampaignAccount(data: Uint8Array): CampaignAccountData {
    if (!CAMPAIGN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CampaignAccount discriminator mismatch');
    }
    const deserialized = getCampaignAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as CampaignAccountData;
}

export async function fetchCampaignAccount(connection: Connection, address: Address): Promise<CampaignAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Campaign account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeCampaignAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeCampaignAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(CampaignAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeCampaignAccount(accountInfo.data),
        };
    });
}

export async function fetchAllCampaignAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<CampaignAccount[]> {
    const maybeAccounts = await fetchAllMaybeCampaignAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Campaign account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is CampaignAccount => a !== null);
}

export async function fetchProgramAccountsCampaign(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<CampaignAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '9PayLifPYdD' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeCampaignAccount(account.data),
    }));
}
