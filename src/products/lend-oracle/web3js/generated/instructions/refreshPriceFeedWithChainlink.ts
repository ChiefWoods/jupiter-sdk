import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const REFRESH_PRICE_FEED_WITH_CHAINLINK_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    74, 3, 0, 183, 242, 117, 152, 203,
]);

export interface RefreshPriceFeedWithChainlinkInstructionAccounts {
    signer: Address;
    chainlinkDsCache: Address;
    verifierAccount: Address;
    accessController: Address;
    configAccount: Address;
    verifierProgramId: Address;
}

export interface RefreshPriceFeedWithChainlinkInstructionArgs {
    feedId: ReadonlyUint8Array;
    serializedReport: ReadonlyUint8Array;
}

function getRefreshPriceFeedWithChainlinkInstructionDataEncoder(): Encoder<RefreshPriceFeedWithChainlinkInstructionArgs> {
    return getStructEncoder([
        ['feedId', fixEncoderSize(getBytesEncoder(), 32)],
        ['serializedReport', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

function getRefreshPriceFeedWithChainlinkInstructionDataDecoder(): Decoder<RefreshPriceFeedWithChainlinkInstructionArgs> {
    return getStructDecoder([
        ['feedId', fixDecoderSize(getBytesDecoder(), 32)],
        ['serializedReport', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ]);
}

export interface ParsedRefreshPriceFeedWithChainlinkInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        chainlinkDsCache: AccountMeta;
        verifierAccount: AccountMeta;
        accessController: AccountMeta;
        configAccount: AccountMeta;
        verifierProgramId: AccountMeta;
    };
    data: RefreshPriceFeedWithChainlinkInstructionArgs;
}

export function parseRefreshPriceFeedWithChainlinkInstruction(
    instruction: TransactionInstruction,
): ParsedRefreshPriceFeedWithChainlinkInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for RefreshPriceFeedWithChainlink instruction');
    }
    if (
        !REFRESH_PRICE_FEED_WITH_CHAINLINK_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('RefreshPriceFeedWithChainlink instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            chainlinkDsCache: instruction.keys[1]!,
            verifierAccount: instruction.keys[2]!,
            accessController: instruction.keys[3]!,
            configAccount: instruction.keys[4]!,
            verifierProgramId: instruction.keys[5]!,
        },
        data: getRefreshPriceFeedWithChainlinkInstructionDataDecoder().decode(instructionData),
    };
}

export function createRefreshPriceFeedWithChainlinkInstruction(
    accounts: RefreshPriceFeedWithChainlinkInstructionAccounts,
    args: RefreshPriceFeedWithChainlinkInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
        { pubkey: accounts.verifierAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.accessController, isSigner: false, isWritable: false },
        { pubkey: accounts.configAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.verifierProgramId, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRefreshPriceFeedWithChainlinkInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REFRESH_PRICE_FEED_WITH_CHAINLINK_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
