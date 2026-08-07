import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const GET_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([153, 76, 17, 194, 170, 215, 89, 142]);

export interface GetExchangeRateInstructionAccounts {
    oracle: Address;
}

export interface GetExchangeRateInstructionArgs {
    nonce: number;
}

function getGetExchangeRateInstructionDataEncoder(): Encoder<GetExchangeRateInstructionArgs> {
    return getStructEncoder([['nonce', getU16Encoder()]]);
}

function getGetExchangeRateInstructionDataDecoder(): Decoder<GetExchangeRateInstructionArgs> {
    return getStructDecoder([['nonce', getU16Decoder()]]);
}

export interface ParsedGetExchangeRateInstruction {
    programId: Address;
    accounts: {
        oracle: AccountMeta;
    };
    data: GetExchangeRateInstructionArgs;
}

export function parseGetExchangeRateInstruction(instruction: TransactionInstruction): ParsedGetExchangeRateInstruction {
    if (instruction.keys.length < 1) {
        throw new Error('Expected 1 account metas for GetExchangeRate instruction');
    }
    if (!GET_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('GetExchangeRate instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            oracle: instruction.keys[0]!,
        },
        data: getGetExchangeRateInstructionDataDecoder().decode(instructionData),
    };
}

export function createGetExchangeRateInstruction(
    accounts: GetExchangeRateInstructionAccounts,
    args: GetExchangeRateInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    let data = Buffer.from(getGetExchangeRateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
