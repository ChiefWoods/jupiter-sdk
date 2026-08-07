import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_DEX_INSTRUCTION_DISCRIMINATOR = new Uint8Array([222, 187, 81, 48, 89, 117, 230, 164]);

export interface InitDexInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    dexMetadata: Address;
    token0: Address;
    token1: Address;
    systemProgram: Address;
}

export interface InitDexInstructionArgs {
    centerPrice: number | bigint;
    fee: number;
    revenueCut: number;
    upperPercent: number;
    lowerPercent: number;
    upperShiftThreshold: number;
    lowerShiftThreshold: number;
    thresholdShiftTime: number;
    maxCenterPrice: number | bigint;
    minCenterPrice: number | bigint;
}

function getInitDexInstructionDataEncoder(): Encoder<InitDexInstructionArgs> {
    return getStructEncoder([
        ['centerPrice', getU64Encoder()],
        ['fee', getU32Encoder()],
        ['revenueCut', getU32Encoder()],
        ['upperPercent', getU32Encoder()],
        ['lowerPercent', getU32Encoder()],
        ['upperShiftThreshold', getU32Encoder()],
        ['lowerShiftThreshold', getU32Encoder()],
        ['thresholdShiftTime', getU32Encoder()],
        ['maxCenterPrice', getU64Encoder()],
        ['minCenterPrice', getU64Encoder()],
    ]);
}

function getInitDexInstructionDataDecoder(): Decoder<InitDexInstructionArgs> {
    return getStructDecoder([
        ['centerPrice', getU64Decoder()],
        ['fee', getU32Decoder()],
        ['revenueCut', getU32Decoder()],
        ['upperPercent', getU32Decoder()],
        ['lowerPercent', getU32Decoder()],
        ['upperShiftThreshold', getU32Decoder()],
        ['lowerShiftThreshold', getU32Decoder()],
        ['thresholdShiftTime', getU32Decoder()],
        ['maxCenterPrice', getU64Decoder()],
        ['minCenterPrice', getU64Decoder()],
    ]);
}

export interface ParsedInitDexInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        dexMetadata: AccountMeta;
        token0: AccountMeta;
        token1: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitDexInstructionArgs;
}

export function parseInitDexInstruction(instruction: TransactionInstruction): ParsedInitDexInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for InitDex instruction');
    }
    if (!INIT_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitDex instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
            dexMetadata: instruction.keys[3]!,
            token0: instruction.keys[4]!,
            token1: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
        },
        data: getInitDexInstructionDataDecoder().decode(instructionData),
    };
}

export function createInitDexInstruction(
    accounts: InitDexInstructionAccounts,
    args: InitDexInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.dexMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.token0, isSigner: false, isWritable: false },
        { pubkey: accounts.token1, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitDexInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_DEX_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
