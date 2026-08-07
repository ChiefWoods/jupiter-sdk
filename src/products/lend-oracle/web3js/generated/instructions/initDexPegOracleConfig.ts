import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import { findDexPegConfigPda } from '../pdas/dexPegConfig';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getDexPegOracleKindDecoder,
    getDexPegOracleKindEncoder,
    type DexPegOracleKindArgs,
} from '../types/dexPegOracleKind';
import { getSourcesDecoder, getSourcesEncoder, type SourcesArgs } from '../types/sources';

export const INIT_DEX_PEG_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([163, 158, 180, 74, 201, 54, 7, 48]);

export interface InitDexPegOracleConfigInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    dexPegConfig?: Address;
    dex: Address;
    positionToken0: Address;
    positionToken1: Address;
    tokenReserve0: Address;
    tokenReserve1: Address;
    systemProgram: Address;
}

export interface InitDexPegOracleConfigInstructionArgs {
    nonce: number;
    kind: DexPegOracleKindArgs;
    pegBufferPercent: number | bigint;
    quoteInToken0: boolean;
    conversionSource: SourcesArgs;
}

function getInitDexPegOracleConfigInstructionDataEncoder(): Encoder<InitDexPegOracleConfigInstructionArgs> {
    return getStructEncoder([
        ['nonce', getU16Encoder()],
        ['kind', getDexPegOracleKindEncoder()],
        ['pegBufferPercent', getU128Encoder()],
        ['quoteInToken0', getBooleanEncoder()],
        ['conversionSource', getSourcesEncoder()],
    ]);
}

function getInitDexPegOracleConfigInstructionDataDecoder(): Decoder<InitDexPegOracleConfigInstructionArgs> {
    return getStructDecoder([
        ['nonce', getU16Decoder()],
        ['kind', getDexPegOracleKindDecoder()],
        ['pegBufferPercent', getU128Decoder()],
        ['quoteInToken0', getBooleanDecoder()],
        ['conversionSource', getSourcesDecoder()],
    ]);
}

export interface ParsedInitDexPegOracleConfigInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        oracleAdmin: AccountMeta;
        dexPegConfig: AccountMeta;
        dex: AccountMeta;
        positionToken0: AccountMeta;
        positionToken1: AccountMeta;
        tokenReserve0: AccountMeta;
        tokenReserve1: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitDexPegOracleConfigInstructionArgs;
}

export function parseInitDexPegOracleConfigInstruction(
    instruction: TransactionInstruction,
): ParsedInitDexPegOracleConfigInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for InitDexPegOracleConfig instruction');
    }
    if (
        !INIT_DEX_PEG_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InitDexPegOracleConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            oracleAdmin: instruction.keys[1]!,
            dexPegConfig: instruction.keys[2]!,
            dex: instruction.keys[3]!,
            positionToken0: instruction.keys[4]!,
            positionToken1: instruction.keys[5]!,
            tokenReserve0: instruction.keys[6]!,
            tokenReserve1: instruction.keys[7]!,
            systemProgram: instruction.keys[8]!,
        },
        data: getInitDexPegOracleConfigInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitDexPegOracleConfigInstruction(
    accounts: InitDexPegOracleConfigInstructionAccounts,
    args: InitDexPegOracleConfigInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let dexPegConfig = accounts.dexPegConfig;
    if (!dexPegConfig) {
        const [derived] = await findDexPegConfigPda(
            {
                nonce: args.nonce,
            },
            programId,
        );
        dexPegConfig = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: dexPegConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.positionToken0, isSigner: false, isWritable: false },
        { pubkey: accounts.positionToken1, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve0, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve1, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitDexPegOracleConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_DEX_PEG_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
