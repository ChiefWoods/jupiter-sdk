import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';

export interface OptionProposalMetaAccountData {
    proposal: Address;
    optionDescriptions: Array<string>;
}

export interface OptionProposalMetaAccount {
    address: Address;
    data: OptionProposalMetaAccountData;
}

const OptionProposalMetaAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'proposal',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['optionDescriptions', getArrayCodec(addCodecSizePrefix(getUtf8Codec(), getU32Codec()))],
]);

export function deserializeOptionProposalMetaAccount(data: Uint8Array): OptionProposalMetaAccountData {
    const deserialized = OptionProposalMetaAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as OptionProposalMetaAccountData;
}

export async function fetchOptionProposalMetaAccount(
    connection: Connection,
    address: Address,
): Promise<OptionProposalMetaAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('OptionProposalMeta account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeOptionProposalMetaAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeOptionProposalMetaAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(OptionProposalMetaAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeOptionProposalMetaAccount(accountInfo.data),
        };
    });
}

export async function fetchAllOptionProposalMetaAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<OptionProposalMetaAccount[]> {
    const maybeAccounts = await fetchAllMaybeOptionProposalMetaAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('OptionProposalMeta account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is OptionProposalMetaAccount => a !== null);
}

export async function fetchProgramAccountsOptionProposalMeta(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<OptionProposalMetaAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: 'aVQayGjys93' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeOptionProposalMetaAccount(account.data),
    }));
}
