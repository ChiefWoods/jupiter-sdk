import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FeedEntry, feedEntryCodec } from '../types/feedEntry';
import { ORACLE_PROGRAM_ID } from '..';
import { getArrayCodec, getStructCodec } from '@solana/codecs';

export interface UpdateChainlinkDataStreamsCacheFeedsInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache: Address;
}

export interface UpdateChainlinkDataStreamsCacheFeedsInstructionArgs {
    feeds: Array<FeedEntry>;
}

const UpdateChainlinkDataStreamsCacheFeedsInstructionDataCodec = getStructCodec([
    ['feeds', getArrayCodec(feedEntryCodec)],
]);

export function createUpdateChainlinkDataStreamsCacheFeedsInstruction(
    accounts: UpdateChainlinkDataStreamsCacheFeedsInstructionAccounts,
    args: UpdateChainlinkDataStreamsCacheFeedsInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateChainlinkDataStreamsCacheFeedsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('37455dcb901ef8ad', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
