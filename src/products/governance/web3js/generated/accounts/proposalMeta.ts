import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getStructDecoder,
    getU32Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const PROPOSAL_META_ACCOUNT_DISCRIMINATOR = new Uint8Array([50, 100, 46, 24, 151, 174, 216, 78]);

export type ProposalMetaAccountData = {
    /** The [Proposal]. */
    proposal: Address;
    /** Title of the proposal. */
    title: string;
    /** Link to a description of the proposal. */
    descriptionLink: string;
};

export interface ProposalMetaAccount {
    address: Address;
    data: ProposalMetaAccountData;
}

function getProposalMetaAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** The [Proposal]. */
    proposal: Address;
    /** Title of the proposal. */
    title: string;
    /** Link to a description of the proposal. */
    descriptionLink: string;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['title', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['descriptionLink', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ]);
}

export function deserializeProposalMetaAccount(data: Uint8Array): ProposalMetaAccountData {
    if (!PROPOSAL_META_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ProposalMetaAccount discriminator mismatch');
    }
    const deserialized = getProposalMetaAccountDataDecoder().decode(data);
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
