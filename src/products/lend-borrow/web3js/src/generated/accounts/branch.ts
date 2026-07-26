import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixCodecSize,
    getBytesCodec,
    getI32Codec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
} from '@solana/codecs';

export interface BranchAccountData {
    vaultId: number;
    branchId: number;
    status: number;
    minimaTick: number;
    minimaTickPartials: number;
    debtLiquidity: bigint;
    debtFactor: bigint;
    connectedBranchId: number;
    connectedMinimaTick: number;
}

export interface BranchAccount {
    address: Address;
    data: BranchAccountData;
}

const BranchAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['vaultId', getU16Codec()],
    ['branchId', getU32Codec()],
    ['status', getU8Codec()],
    ['minimaTick', getI32Codec()],
    ['minimaTickPartials', getU32Codec()],
    ['debtLiquidity', getU64Codec()],
    ['debtFactor', getU64Codec()],
    ['connectedBranchId', getU32Codec()],
    ['connectedMinimaTick', getI32Codec()],
]);

export function deserializeBranchAccount(data: Uint8Array): BranchAccountData {
    const deserialized = BranchAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as BranchAccountData;
}

export async function fetchBranchAccount(connection: Connection, address: Address): Promise<BranchAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Branch account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeBranchAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeBranchAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(BranchAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeBranchAccount(accountInfo.data),
        };
    });
}

export async function fetchAllBranchAccounts(connection: Connection, addresses: Address[]): Promise<BranchAccount[]> {
    const maybeAccounts = await fetchAllMaybeBranchAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Branch account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is BranchAccount => a !== null);
}

export async function fetchProgramAccountsBranch(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<BranchAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '3PDkN1tPMSk' } }, { dataSize: 47 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeBranchAccount(account.data),
    }));
}
