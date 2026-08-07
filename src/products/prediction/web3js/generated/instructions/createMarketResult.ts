import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getBooleanDecoder,
    getBooleanEncoder,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU8Decoder,
    getU8Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_MARKET_RESULT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([51, 39, 218, 9, 68, 94, 136, 115]);

export interface CreateMarketResultInstructionAccounts {
    authority: Address;
    marketResult: Address;
    systemProgram: Address;
}

export interface CreateMarketResultInstructionArgs {
    marketId: string;
    outcome: number;
    settlementTime: number | bigint;
    claimsEnabled: boolean;
}

function getCreateMarketResultInstructionDataEncoder(): Encoder<CreateMarketResultInstructionArgs> {
    return getStructEncoder([
        ['marketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['outcome', getU8Encoder()],
        ['settlementTime', getI64Encoder()],
        ['claimsEnabled', getBooleanEncoder()],
    ]);
}

function getCreateMarketResultInstructionDataDecoder(): Decoder<CreateMarketResultInstructionArgs> {
    return getStructDecoder([
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['outcome', getU8Decoder()],
        ['settlementTime', getI64Decoder()],
        ['claimsEnabled', getBooleanDecoder()],
    ]);
}

export interface ParsedCreateMarketResultInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        marketResult: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateMarketResultInstructionArgs;
}

export function parseCreateMarketResultInstruction(
    instruction: TransactionInstruction,
): ParsedCreateMarketResultInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for CreateMarketResult instruction');
    }
    if (!CREATE_MARKET_RESULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateMarketResult instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            marketResult: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getCreateMarketResultInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateMarketResultInstruction(
    accounts: CreateMarketResultInstructionAccounts,
    args: CreateMarketResultInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateMarketResultInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_MARKET_RESULT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
