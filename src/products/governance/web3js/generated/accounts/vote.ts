import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const VOTE_ACCOUNT_DISCRIMINATOR = new Uint8Array([96, 91, 104, 57, 145, 35, 172, 155]);

export type VoteAccountData = {
    /** The proposal being voted on. */
    proposal: Address;
    /** The voter. */
    voter: Address;
    /** Bump seed */
    bump: number;
    /** The side of the vote taken. */
    side: number;
    /** The number of votes this vote holds. */
    votingPower: bigint;
    /** Flag to check whether voter has claim the reward or not */
    claimed: boolean;
    /** buffers for future use */
    buffers: ReadonlyUint8Array;
};

export interface VoteAccount {
    address: Address;
    data: VoteAccountData;
}

function getVoteAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** The proposal being voted on. */
    proposal: Address;
    /** The voter. */
    voter: Address;
    /** Bump seed */
    bump: number;
    /** The side of the vote taken. */
    side: number;
    /** The number of votes this vote holds. */
    votingPower: bigint;
    /** Flag to check whether voter has claim the reward or not */
    claimed: boolean;
    /** buffers for future use */
    buffers: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['voter', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['bump', getU8Decoder()],
        ['side', getU8Decoder()],
        ['votingPower', getU64Decoder()],
        ['claimed', getBooleanDecoder()],
        ['buffers', fixDecoderSize(getBytesDecoder(), 32)],
    ]);
}

export function deserializeVoteAccount(data: Uint8Array): VoteAccountData {
    if (!VOTE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VOTEACCOUNT discriminator mismatch');
    }
    const deserialized = getVoteAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as VoteAccountData;
}

export async function fetchVoteAccount(connection: Connection, address: Address): Promise<VoteAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Vote account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeVoteAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeVoteAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(VoteAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeVoteAccount(accountInfo.data),
        };
    });
}

export async function fetchAllVoteAccounts(connection: Connection, addresses: Address[]): Promise<VoteAccount[]> {
    const maybeAccounts = await fetchAllMaybeVoteAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Vote account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is VoteAccount => a !== null);
}

export async function fetchProgramAccountsVote(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<VoteAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'H7nUxx34RXx' } }, { dataSize: 115 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeVoteAccount(account.data),
    }));
}
