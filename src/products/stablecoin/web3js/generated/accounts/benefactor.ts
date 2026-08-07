import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU16Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getBenefactorStatusDecoder, type BenefactorStatus } from '../types/benefactorStatus';
import { getFeeOverrideDecoder, type FeeOverride } from '../types/feeOverride';
import { getPeriodLimitDecoder, type PeriodLimit } from '../types/periodLimit';

export const BENEFACTOR_ACCOUNT_DISCRIMINATOR = new Uint8Array([98, 159, 41, 233, 19, 232, 104, 12]);

export type BenefactorAccountData = {
    authority: Address;
    status: BenefactorStatus;
    padding0: ReadonlyUint8Array;
    mintFeeRate: number;
    redeemFeeRate: number;
    padding1: ReadonlyUint8Array;
    periodLimits: Array<PeriodLimit>;
    totalMinted: ReadonlyUint8Array;
    totalRedeemed: ReadonlyUint8Array;
    feeOverrides: Array<FeeOverride>;
    reserved: ReadonlyUint8Array;
};

export interface BenefactorAccount {
    address: Address;
    data: BenefactorAccountData;
}

function getBenefactorAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    authority: Address;
    status: BenefactorStatus;
    padding0: ReadonlyUint8Array;
    mintFeeRate: number;
    redeemFeeRate: number;
    padding1: ReadonlyUint8Array;
    periodLimits: Array<PeriodLimit>;
    totalMinted: ReadonlyUint8Array;
    totalRedeemed: ReadonlyUint8Array;
    feeOverrides: Array<FeeOverride>;
    reserved: ReadonlyUint8Array;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['status', getBenefactorStatusDecoder()],
        ['padding0', fixDecoderSize(getBytesDecoder(), 7)],
        ['mintFeeRate', getU16Decoder()],
        ['redeemFeeRate', getU16Decoder()],
        ['padding1', fixDecoderSize(getBytesDecoder(), 4)],
        ['periodLimits', getArrayDecoder(getPeriodLimitDecoder(), { size: 4 })],
        ['totalMinted', fixDecoderSize(getBytesDecoder(), 16)],
        ['totalRedeemed', fixDecoderSize(getBytesDecoder(), 16)],
        ['feeOverrides', getArrayDecoder(getFeeOverrideDecoder(), { size: 4 })],
        ['reserved', fixDecoderSize(getBytesDecoder(), 96)],
    ]);
}

export function deserializeBenefactorAccount(data: Uint8Array): BenefactorAccountData {
    if (!BENEFACTOR_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('BENEFACTORACCOUNT discriminator mismatch');
    }
    const deserialized = getBenefactorAccountDataDecoder().decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as BenefactorAccountData;
}

export async function fetchBenefactorAccount(connection: Connection, address: Address): Promise<BenefactorAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Benefactor account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeBenefactorAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeBenefactorAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(BenefactorAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeBenefactorAccount(accountInfo.data),
        };
    });
}

export async function fetchAllBenefactorAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<BenefactorAccount[]> {
    const maybeAccounts = await fetchAllMaybeBenefactorAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('Benefactor account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is BenefactorAccount => a !== null);
}

export async function fetchProgramAccountsBenefactor(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<BenefactorAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'HVkkdxqEhVm' } }, { dataSize: 536 }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeBenefactorAccount(account.data),
    }));
}
