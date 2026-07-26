import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { Asset, assetCodec } from '../types/asset';
import { LoanStatus, loanStatusCodec } from '../types/loanStatus';
import { LoanType, loanTypeCodec } from '../types/loanType';
import {
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface LoanAccountData {
    lender: Address;
    borrower: Address;
    creator: Address;
    offer: Address;
    status: LoanStatus;
    loanType: LoanType;
    padding: Uint8Array;
    fillIndex: bigint;
    principal: Asset;
    padding1: Uint8Array;
    collateral: Asset;
    padding2: Uint8Array;
    apy: number;
    duration: number;
    principalAmount: bigint;
    collateralAmount: bigint;
    interest: bigint;
    createdAt: bigint;
    expiredAt: bigint;
    updatedAt: bigint;
    bump: number;
    collateralAccountBump: number;
    padding4: Uint8Array;
    reserved: Uint8Array;
}

export interface LoanAccount {
    address: Address;
    data: LoanAccountData;
}

const LoanAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'lender',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'borrower',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'offer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['status', loanStatusCodec],
    ['loanType', loanTypeCodec],
    ['padding', fixCodecSize(getBytesCodec(), 6)],
    ['fillIndex', getU64Codec()],
    ['principal', assetCodec],
    ['padding1', fixCodecSize(getBytesCodec(), 7)],
    ['collateral', assetCodec],
    ['padding2', fixCodecSize(getBytesCodec(), 7)],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['principalAmount', getU64Codec()],
    ['collateralAmount', getU64Codec()],
    ['interest', getU64Codec()],
    ['createdAt', getU64Codec()],
    ['expiredAt', getU64Codec()],
    ['updatedAt', getU64Codec()],
    ['bump', getU8Codec()],
    ['collateralAccountBump', getU8Codec()],
    ['padding4', fixCodecSize(getBytesCodec(), 6)],
    ['reserved', fixCodecSize(getBytesCodec(), 48)],
]);

export function deserializeLoanAccount(data: Uint8Array): LoanAccountData {
    const deserialized = LoanAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as LoanAccountData;
}

export async function fetchLoanAccount(connection: Connection, address: Address): Promise<LoanAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Loan account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeLoanAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeLoanAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(LoanAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeLoanAccount(accountInfo.data),
        };
    });
}

export async function fetchAllLoanAccounts(connection: Connection, addresses: Address[]): Promise<LoanAccount[]> {
    const maybeAccounts = await fetchAllMaybeLoanAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Loan account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is LoanAccount => a !== null);
}

export async function fetchProgramAccountsLoan(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<LoanAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '4URf4twWraU' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeLoanAccount(account.data),
    }));
}
