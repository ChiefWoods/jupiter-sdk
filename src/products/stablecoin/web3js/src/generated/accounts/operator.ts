import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { OperatorStatus, operatorStatusCodec } from '../types/operatorStatus';
import { fixCodecSize, getBytesCodec, getStructCodec, getU64Codec, transformCodec } from '@solana/codecs';

export interface OperatorAccountData {
    operatorAuthority: Address;
    role: bigint;
    status: OperatorStatus;
    padding0: Uint8Array;
    reserved: Uint8Array;
}

export interface OperatorAccount {
    address: Address;
    data: OperatorAccountData;
}

const OperatorAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'operatorAuthority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['role', getU64Codec()],
    ['status', operatorStatusCodec],
    ['padding0', fixCodecSize(getBytesCodec(), 7)],
    ['reserved', fixCodecSize(getBytesCodec(), 128)],
]);

export function deserializeOperatorAccount(data: Uint8Array): OperatorAccountData {
    const deserialized = OperatorAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as OperatorAccountData;
}

export async function fetchOperatorAccount(connection: Connection, address: Address): Promise<OperatorAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Operator account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeOperatorAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeOperatorAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(OperatorAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeOperatorAccount(accountInfo.data),
        };
    });
}

export async function fetchAllOperatorAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<OperatorAccount[]> {
    const maybeAccounts = await fetchAllMaybeOperatorAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Operator account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is OperatorAccount => a !== null);
}

export async function fetchProgramAccountsOperator(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<OperatorAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'den4r2UNWEQ' } }, { dataSize: 184 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeOperatorAccount(account.data),
    }));
}
