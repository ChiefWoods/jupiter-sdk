import { Address, Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getStructDecoder,
    getU32Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const OPTION_PROPOSAL_META_ACCOUNT_DISCRIMINATOR = new Uint8Array([200, 56, 229, 124, 113, 154, 32, 26]);

export type OptionProposalMetaAccountData = {
    /** The [Proposal]. */
    proposal: Address;
    /** description for options */
    optionDescriptions: Array<string>;
};

export interface OptionProposalMetaAccount {
    address: Address;
    data: OptionProposalMetaAccountData;
}

function getOptionProposalMetaAccountDataDecoder(): Decoder<{
    discriminator: ReadonlyUint8Array;
    /** The [Proposal]. */
    proposal: Address;
    /** description for options */
    optionDescriptions: Array<string>;
}> {
    return getStructDecoder([
        ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
        ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['optionDescriptions', getArrayDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
    ]);
}

export function deserializeOptionProposalMetaAccount(data: Uint8Array): OptionProposalMetaAccountData {
    if (!OPTION_PROPOSAL_META_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OPTIONPROPOSALMETAACCOUNT discriminator mismatch');
    }
    const deserialized = getOptionProposalMetaAccountDataDecoder().decode(data);
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
