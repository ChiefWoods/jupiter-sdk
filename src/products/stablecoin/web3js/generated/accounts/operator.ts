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
import { getOperatorStatusDecoder, type OperatorStatus } from '../types/operatorStatus';

export const OPERATOR_ACCOUNT_DISCRIMINATOR = new Uint8Array([219, 31, 188, 145, 69, 139, 204, 117]);

export type OperatorAccountData = {
    operatorAuthority: Address;
    role: bigint;
    status: OperatorStatus;
    padding0: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
};

export interface OperatorAccount {
    address: Address;
    data: OperatorAccountData;
}

function getOperatorAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    operatorAuthority: Address;
    role: bigint;
    status: OperatorStatus;
    padding0: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['operatorAuthority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['role', getU64Decoder()],
        ['status', getOperatorStatusDecoder()],
        ['padding0', fixDecoderSize(getBytesDecoder(), 7)],
        ['reserved', fixDecoderSize(getBytesDecoder(), 128)],
    ]);
}

export function deserializeOperatorAccount(data: Uint8Array): OperatorAccountData {
    if (!OPERATOR_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OPERATORACCOUNT discriminator mismatch');
    }
    const deserialized = getOperatorAccountDataDecoder().decode(data);
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
