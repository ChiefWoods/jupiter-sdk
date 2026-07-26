import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { BenefactorStatus, benefactorStatusCodec } from '../types/benefactorStatus';
import { FeeOverride, feeOverrideCodec } from '../types/feeOverride';
import { PeriodLimit, periodLimitCodec } from '../types/periodLimit';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    transformCodec,
} from '@solana/codecs';

export interface BenefactorAccountData {
    authority: Address;
    status: BenefactorStatus;
    padding0: Uint8Array;
    mintFeeRate: number;
    redeemFeeRate: number;
    padding1: Uint8Array;
    periodLimits: Array<PeriodLimit>;
    totalMinted: Uint8Array;
    totalRedeemed: Uint8Array;
    feeOverrides: Array<FeeOverride>;
    reserved: Uint8Array;
}

export interface BenefactorAccount {
    address: Address;
    data: BenefactorAccountData;
}

const BenefactorAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['status', benefactorStatusCodec],
    ['padding0', fixCodecSize(getBytesCodec(), 7)],
    ['mintFeeRate', getU16Codec()],
    ['redeemFeeRate', getU16Codec()],
    ['padding1', fixCodecSize(getBytesCodec(), 4)],
    ['periodLimits', getArrayCodec(periodLimitCodec, { size: 4 })],
    ['totalMinted', fixCodecSize(getBytesCodec(), 16)],
    ['totalRedeemed', fixCodecSize(getBytesCodec(), 16)],
    ['feeOverrides', getArrayCodec(feeOverrideCodec, { size: 4 })],
    ['reserved', fixCodecSize(getBytesCodec(), 96)],
]);

export function deserializeBenefactorAccount(data: Uint8Array): BenefactorAccountData {
    const deserialized = BenefactorAccountDataCodec.decode(data);
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
