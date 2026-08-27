import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getAssetDecoder, type Asset } from '../types/asset';
import { getLoanStatusDecoder, type LoanStatus } from '../types/loanStatus';
import { getLoanTypeDecoder, type LoanType } from '../types/loanType';

export const LOAN_ACCOUNT_DISCRIMINATOR = new Uint8Array([20, 195, 70, 117, 165, 227, 182, 1]);

export type LoanAccountData = {
    lender: Address;
    borrower: Address;
    creator: Address;
    offer: Address;
    status: LoanStatus;
    loanType: LoanType;
    padding: ReadonlyUint8Array;
    fillIndex: bigint;
    principal: Asset;
    padding1: ReadonlyUint8Array;
    collateral: Asset;
    padding2: ReadonlyUint8Array;
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
    extendable: number;
    extensionCount: number;
    padding4: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
};

export interface LoanAccount {
    address: Address;
    data: LoanAccountData;
}

function getLoanAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    lender: Address;
    borrower: Address;
    creator: Address;
    offer: Address;
    status: LoanStatus;
    loanType: LoanType;
    padding: ReadonlyUint8Array;
    fillIndex: bigint;
    principal: Asset;
    padding1: ReadonlyUint8Array;
    collateral: Asset;
    padding2: ReadonlyUint8Array;
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
    extendable: number;
    extensionCount: number;
    padding4: ReadonlyUint8Array;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['lender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrower', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['creator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['offer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['status', getLoanStatusDecoder()],
        ['loanType', getLoanTypeDecoder()],
        ['padding', fixDecoderSize(getBytesDecoder(), 6)],
        ['fillIndex', getU64Decoder()],
        ['principal', getAssetDecoder()],
        ['padding1', fixDecoderSize(getBytesDecoder(), 7)],
        ['collateral', getAssetDecoder()],
        ['padding2', fixDecoderSize(getBytesDecoder(), 7)],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['principalAmount', getU64Decoder()],
        ['collateralAmount', getU64Decoder()],
        ['interest', getU64Decoder()],
        ['createdAt', getU64Decoder()],
        ['expiredAt', getU64Decoder()],
        ['updatedAt', getU64Decoder()],
        ['bump', getU8Decoder()],
        ['collateralAccountBump', getU8Decoder()],
        ['extendable', getU8Decoder()],
        ['extensionCount', getU8Decoder()],
        ['padding4', fixDecoderSize(getBytesDecoder(), 4)],
        ['reserved', fixDecoderSize(getBytesDecoder(), 48)],
    ]);
}

export function deserializeLoanAccount(data: Uint8Array): LoanAccountData {
    if (!LOAN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LoanAccount discriminator mismatch');
    }
    const deserialized = getLoanAccountDataDecoder().decode(data);
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
