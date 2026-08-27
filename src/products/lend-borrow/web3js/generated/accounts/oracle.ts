import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getSourcesDecoder, type Sources } from '../types/sources';

export const ORACLE_ACCOUNT_DISCRIMINATOR = new Uint8Array([139, 194, 131, 179, 140, 179, 229, 244]);

export type OracleAccountData = { nonce: number; sources: Array<Sources>; bump: number };

export interface OracleAccount {
    address: Address;
    data: OracleAccountData;
}

function getOracleAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    nonce: number;
    sources: Array<Sources>;
    bump: number;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['nonce', getU16Decoder()],
        ['sources', getArrayDecoder(getSourcesDecoder())],
        ['bump', getU8Decoder()],
    ]);
}

export function deserializeOracleAccount(data: Uint8Array): OracleAccountData {
    if (!ORACLE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OracleAccount discriminator mismatch');
    }
    const deserialized = getOracleAccountDataDecoder().decode(data);
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
