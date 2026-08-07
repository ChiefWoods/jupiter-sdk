import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import { getAddressBoolDecoder, getAddressBoolEncoder, type AddressBoolArgs } from '../types/addressBool';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_CHAINLINK_DATA_STREAMS_CACHE_KEEPERS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    125, 168, 188, 187, 148, 203, 102, 87,
]);

export interface UpdateChainlinkDataStreamsCacheKeepersInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache: Address;
}

export interface UpdateChainlinkDataStreamsCacheKeepersInstructionArgs {
    keeperStatus: Array<AddressBoolArgs>;
}

function getUpdateChainlinkDataStreamsCacheKeepersInstructionDataEncoder(): Encoder<UpdateChainlinkDataStreamsCacheKeepersInstructionArgs> {
    return getStructEncoder([['keeperStatus', getArrayEncoder(getAddressBoolEncoder())]]);
}

function getUpdateChainlinkDataStreamsCacheKeepersInstructionDataDecoder(): Decoder<UpdateChainlinkDataStreamsCacheKeepersInstructionArgs> {
    return getStructDecoder([['keeperStatus', getArrayDecoder(getAddressBoolDecoder())]]);
}

export interface ParsedUpdateChainlinkDataStreamsCacheKeepersInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        oracleAdmin: AccountMeta;
        chainlinkDsCache: AccountMeta;
    };
    data: UpdateChainlinkDataStreamsCacheKeepersInstructionArgs;
}

export function parseUpdateChainlinkDataStreamsCacheKeepersInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateChainlinkDataStreamsCacheKeepersInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateChainlinkDataStreamsCacheKeepers instruction');
    }
    if (
        !UPDATE_CHAINLINK_DATA_STREAMS_CACHE_KEEPERS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateChainlinkDataStreamsCacheKeepers instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            oracleAdmin: instruction.keys[1]!,
            chainlinkDsCache: instruction.keys[2]!,
        },
        data: getUpdateChainlinkDataStreamsCacheKeepersInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateChainlinkDataStreamsCacheKeepersInstruction(
    accounts: UpdateChainlinkDataStreamsCacheKeepersInstructionAccounts,
    args: UpdateChainlinkDataStreamsCacheKeepersInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateChainlinkDataStreamsCacheKeepersInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_CHAINLINK_DATA_STREAMS_CACHE_KEEPERS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
