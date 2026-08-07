import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CHAINLINK_DATA_STREAMS_FEED_ACCESS_CONTROLLER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    181, 88, 179, 151, 225, 38, 9, 6,
]);

export interface ChainlinkDataStreamsFeedAccessControllerInstructionAccounts {
    authority: Address;
    chainlinkDsCache: Address;
}

export interface ChainlinkDataStreamsFeedAccessControllerInstructionArgs {
    suspend: boolean;
}

function getChainlinkDataStreamsFeedAccessControllerInstructionDataEncoder(): Encoder<ChainlinkDataStreamsFeedAccessControllerInstructionArgs> {
    return getStructEncoder([['suspend', getBooleanEncoder()]]);
}

function getChainlinkDataStreamsFeedAccessControllerInstructionDataDecoder(): Decoder<ChainlinkDataStreamsFeedAccessControllerInstructionArgs> {
    return getStructDecoder([['suspend', getBooleanDecoder()]]);
}

export interface ParsedChainlinkDataStreamsFeedAccessControllerInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        chainlinkDsCache: AccountMeta;
    };
    data: ChainlinkDataStreamsFeedAccessControllerInstructionArgs;
}

export function parseChainlinkDataStreamsFeedAccessControllerInstruction(
    instruction: TransactionInstruction,
): ParsedChainlinkDataStreamsFeedAccessControllerInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for ChainlinkDataStreamsFeedAccessController instruction');
    }
    if (
        !CHAINLINK_DATA_STREAMS_FEED_ACCESS_CONTROLLER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('ChainlinkDataStreamsFeedAccessController instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            chainlinkDsCache: instruction.keys[1]!,
        },
        data: getChainlinkDataStreamsFeedAccessControllerInstructionDataDecoder().decode(instructionData),
    };
}

export function createChainlinkDataStreamsFeedAccessControllerInstruction(
    accounts: ChainlinkDataStreamsFeedAccessControllerInstructionAccounts,
    args: ChainlinkDataStreamsFeedAccessControllerInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getChainlinkDataStreamsFeedAccessControllerInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CHAINLINK_DATA_STREAMS_FEED_ACCESS_CONTROLLER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
