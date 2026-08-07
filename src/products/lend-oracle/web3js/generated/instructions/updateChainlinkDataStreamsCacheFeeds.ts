import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getFeedEntryDecoder, getFeedEntryEncoder, type FeedEntryArgs } from '../types/feedEntry';

export const UPDATE_CHAINLINK_DATA_STREAMS_CACHE_FEEDS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    55, 69, 93, 203, 144, 30, 248, 173,
]);

export interface UpdateChainlinkDataStreamsCacheFeedsInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache: Address;
}

export interface UpdateChainlinkDataStreamsCacheFeedsInstructionArgs {
    feeds: Array<FeedEntryArgs>;
}

function getUpdateChainlinkDataStreamsCacheFeedsInstructionDataEncoder(): Encoder<UpdateChainlinkDataStreamsCacheFeedsInstructionArgs> {
    return getStructEncoder([['feeds', getArrayEncoder(getFeedEntryEncoder())]]);
}

function getUpdateChainlinkDataStreamsCacheFeedsInstructionDataDecoder(): Decoder<UpdateChainlinkDataStreamsCacheFeedsInstructionArgs> {
    return getStructDecoder([['feeds', getArrayDecoder(getFeedEntryDecoder())]]);
}

export interface ParsedUpdateChainlinkDataStreamsCacheFeedsInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        oracleAdmin: AccountMeta;
        chainlinkDsCache: AccountMeta;
    };
    data: UpdateChainlinkDataStreamsCacheFeedsInstructionArgs;
}

export function parseUpdateChainlinkDataStreamsCacheFeedsInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateChainlinkDataStreamsCacheFeedsInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateChainlinkDataStreamsCacheFeeds instruction');
    }
    if (
        !UPDATE_CHAINLINK_DATA_STREAMS_CACHE_FEEDS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateChainlinkDataStreamsCacheFeeds instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            oracleAdmin: instruction.keys[1]!,
            chainlinkDsCache: instruction.keys[2]!,
        },
        data: getUpdateChainlinkDataStreamsCacheFeedsInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateChainlinkDataStreamsCacheFeedsInstruction(
    accounts: UpdateChainlinkDataStreamsCacheFeedsInstructionAccounts,
    args: UpdateChainlinkDataStreamsCacheFeedsInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateChainlinkDataStreamsCacheFeedsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_CHAINLINK_DATA_STREAMS_CACHE_FEEDS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
