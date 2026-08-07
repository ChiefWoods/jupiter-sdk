import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import { findChainlinkDsCachePda } from '../pdas/chainlinkDsCache';
import {
    fixDecoderSize,
    fixEncoderSize,
    getArrayDecoder,
    getArrayEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getFeedEntryDecoder, getFeedEntryEncoder, type FeedEntryArgs } from '../types/feedEntry';

export const INIT_CHAINLINK_DATA_STREAMS_CACHE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    47, 174, 206, 189, 94, 253, 25, 233,
]);

export interface InitChainlinkDataStreamsCacheInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache?: Address;
    systemProgram: Address;
}

export interface InitChainlinkDataStreamsCacheInstructionArgs {
    nonce: number;
    feeds: Array<FeedEntryArgs>;
    keepers: Array<Address>;
}

function getInitChainlinkDataStreamsCacheInstructionDataEncoder(): Encoder<InitChainlinkDataStreamsCacheInstructionArgs> {
    return getStructEncoder([
        ['nonce', getU16Encoder()],
        ['feeds', getArrayEncoder(getFeedEntryEncoder())],
        [
            'keepers',
            getArrayEncoder(
                transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
            ),
        ],
    ]);
}

function getInitChainlinkDataStreamsCacheInstructionDataDecoder(): Decoder<InitChainlinkDataStreamsCacheInstructionArgs> {
    return getStructDecoder([
        ['nonce', getU16Decoder()],
        ['feeds', getArrayDecoder(getFeedEntryDecoder())],
        [
            'keepers',
            getArrayDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
    ]);
}

export interface ParsedInitChainlinkDataStreamsCacheInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        oracleAdmin: AccountMeta;
        chainlinkDsCache: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitChainlinkDataStreamsCacheInstructionArgs;
}

export function parseInitChainlinkDataStreamsCacheInstruction(
    instruction: TransactionInstruction,
): ParsedInitChainlinkDataStreamsCacheInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitChainlinkDataStreamsCache instruction');
    }
    if (
        !INIT_CHAINLINK_DATA_STREAMS_CACHE_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InitChainlinkDataStreamsCache instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            oracleAdmin: instruction.keys[1]!,
            chainlinkDsCache: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitChainlinkDataStreamsCacheInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitChainlinkDataStreamsCacheInstruction(
    accounts: InitChainlinkDataStreamsCacheInstructionAccounts,
    args: InitChainlinkDataStreamsCacheInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let chainlinkDsCache = accounts.chainlinkDsCache;
    if (!chainlinkDsCache) {
        const [derived] = await findChainlinkDsCachePda(
            {
                nonce: args.nonce,
            },
            programId,
        );
        chainlinkDsCache = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: chainlinkDsCache, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitChainlinkDataStreamsCacheInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_CHAINLINK_DATA_STREAMS_CACHE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
