import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface VoteAccountData {
    proposal: Address;
    voter: Address;
    bump: number;
    side: number;
    votingPower: bigint;
    claimed: boolean;
    buffers: Uint8Array;
}

export interface VoteAccount {
    address: Address;
    data: VoteAccountData;
}

const VoteAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'proposal',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'voter',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['bump', getU8Codec()],
    ['side', getU8Codec()],
    ['votingPower', getU64Codec()],
    ['claimed', getBooleanCodec()],
    ['buffers', fixCodecSize(getBytesCodec(), 32)],
]);

export function deserializeVoteAccount(data: Uint8Array): VoteAccountData {
    const deserialized = VoteAccountDataCodec.decode(data);
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
