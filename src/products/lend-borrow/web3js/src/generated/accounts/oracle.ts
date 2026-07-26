import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { Sources, sourcesCodec } from '../types/sources';
import { fixCodecSize, getArrayCodec, getBytesCodec, getStructCodec, getU16Codec, getU8Codec } from '@solana/codecs';

export interface OracleAccountData {
    nonce: number;
    sources: Array<Sources>;
    bump: number;
}

export interface OracleAccount {
    address: Address;
    data: OracleAccountData;
}

const OracleAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['nonce', getU16Codec()],
    ['sources', getArrayCodec(sourcesCodec)],
    ['bump', getU8Codec()],
]);

export function deserializeOracleAccount(data: Uint8Array): OracleAccountData {
    const deserialized = OracleAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as OracleAccountData;
}

export async function fetchOracleAccount(connection: Connection, address: Address): Promise<OracleAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Oracle account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeOracleAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeOracleAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(OracleAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeOracleAccount(accountInfo.data),
        };
    });
}

export async function fetchAllOracleAccounts(connection: Connection, addresses: Address[]): Promise<OracleAccount[]> {
    const maybeAccounts = await fetchAllMaybeOracleAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Oracle account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is OracleAccount => a !== null);
}

export async function fetchProgramAccountsOracle(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<OracleAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'QNr2jtZj1oR' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeOracleAccount(account.data),
    }));
}
