import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type TokenLedgerAccountData = { tokenAccount: Address; amount: bigint };

export interface TokenLedgerAccount {
    address: Address;
    data: TokenLedgerAccountData;
}

function getTokenLedgerAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    tokenAccount: Address;
    amount: bigint;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['tokenAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['amount', getU64Decoder()],
    ]);
}

export function deserializeTokenLedgerAccount(data: Uint8Array): TokenLedgerAccountData {
    const deserialized = getTokenLedgerAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as TokenLedgerAccountData;
}

export async function fetchTokenLedgerAccount(connection: Connection, address: Address): Promise<TokenLedgerAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('TokenLedger account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeTokenLedgerAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeTokenLedgerAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(TokenLedgerAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeTokenLedgerAccount(accountInfo.data),
        };
    });
}

export async function fetchAllTokenLedgerAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<TokenLedgerAccount[]> {
    const maybeAccounts = await fetchAllMaybeTokenLedgerAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('TokenLedger account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is TokenLedgerAccount => a !== null);
}

export async function fetchProgramAccountsTokenLedger(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<TokenLedgerAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'TFkui5QKQvG' } }, { dataSize: 48 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeTokenLedgerAccount(account.data),
    }));
}
