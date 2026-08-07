import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import { findOraclePda } from '../pdas/oracle';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getSourcesDecoder, getSourcesEncoder, type SourcesArgs } from '../types/sources';

export const INIT_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([77, 144, 180, 246, 217, 15, 118, 92]);

export interface InitOracleConfigInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    oracle?: Address;
    systemProgram: Address;
}

export interface InitOracleConfigInstructionArgs {
    sources: Array<SourcesArgs>;
    nonce: number;
}

function getInitOracleConfigInstructionDataEncoder(): Encoder<InitOracleConfigInstructionArgs> {
    return getStructEncoder([
        ['sources', getArrayEncoder(getSourcesEncoder())],
        ['nonce', getU16Encoder()],
    ]);
}

function getInitOracleConfigInstructionDataDecoder(): Decoder<InitOracleConfigInstructionArgs> {
    return getStructDecoder([
        ['sources', getArrayDecoder(getSourcesDecoder())],
        ['nonce', getU16Decoder()],
    ]);
}

export interface ParsedInitOracleConfigInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        oracleAdmin: AccountMeta;
        oracle: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitOracleConfigInstructionArgs;
}

export function parseInitOracleConfigInstruction(
    instruction: TransactionInstruction,
): ParsedInitOracleConfigInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitOracleConfig instruction');
    }
    if (!INIT_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitOracleConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            oracleAdmin: instruction.keys[1]!,
            oracle: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitOracleConfigInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitOracleConfigInstruction(
    accounts: InitOracleConfigInstructionAccounts,
    args: InitOracleConfigInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let oracle = accounts.oracle;
    if (!oracle) {
        const [derived] = await findOraclePda(
            {
                nonce: args.nonce,
            },
            programId,
        );
        oracle = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: oracle, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitOracleConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
