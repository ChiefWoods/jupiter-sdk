import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';

export interface ProposalMetaAccountData {
    proposal: Address;
    title: string;
    descriptionLink: string;
}

export interface ProposalMetaAccount {
    address: Address;
    data: ProposalMetaAccountData;
}

const ProposalMetaAccountDataCodec = getStructCodec([
    ['discriminator', fixCodecSize(getBytesCodec(), 8)],
    [
        'proposal',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['title', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['descriptionLink', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
]);

export function deserializeProposalMetaAccount(data: Uint8Array): ProposalMetaAccountData {
    const deserialized = ProposalMetaAccountDataCodec.decode(data);
    const { discriminator: _, ...accountData } = deserialized;
    return accountData as ProposalMetaAccountData;
}

export async function fetchProposalMetaAccount(connection: Connection, address: Address): Promise<ProposalMetaAccount> {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('ProposalMeta account not found at address: ' + address.toBase58());
    }
    return {
        address,
        data: deserializeProposalMetaAccount(accountInfo.data),
    };
}

export async function fetchAllMaybeProposalMetaAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<(ProposalMetaAccount | null)[]> {
    const accountInfos = await connection.getMultipleAccountsInfo(addresses);
    return accountInfos.map((accountInfo, index) => {
        if (!accountInfo) {
            return null;
        }
        return {
            address: addresses[index],
            data: deserializeProposalMetaAccount(accountInfo.data),
        };
    });
}

export async function fetchAllProposalMetaAccounts(
    connection: Connection,
    addresses: Address[],
): Promise<ProposalMetaAccount[]> {
    const maybeAccounts = await fetchAllMaybeProposalMetaAccounts(connection, addresses);
    const missingAddresses = maybeAccounts
        .flatMap((account, i) => (!account ? [addresses[i].toBase58()] : []))
        .join(', ');
    if (missingAddresses) {
        throw new Error('ProposalMeta account(s) not found at address(es): ' + missingAddresses);
    }
    return maybeAccounts.filter((a): a is ProposalMetaAccount => a !== null);
}

export async function fetchProgramAccountsProposalMeta(
    connection: Connection,
    programId: Address,
    options?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
        filters?: GetProgramAccountsFilter[];
    },
): Promise<ProposalMetaAccount[]> {
    const accounts = await connection.getProgramAccounts(programId, {
        commitment: options?.commitment,
        filters: [...[{ memcmp: { offset: 0, bytes: '9RrphkqUTEV' } }], ...(options?.filters ?? [])],
    });
    return accounts.map(({ pubkey, account }) => ({
        address: pubkey,
        data: deserializeProposalMetaAccount(account.data),
    }));
}
