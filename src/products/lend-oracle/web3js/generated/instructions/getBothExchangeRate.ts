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

export const GET_BOTH_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([92, 88, 161, 46, 230, 193, 46, 237]);

export interface GetBothExchangeRateInstructionAccounts {
    oracle: Address;
}

export interface GetBothExchangeRateInstructionArgs {
    nonce: number;
}

function getGetBothExchangeRateInstructionDataEncoder(): Encoder<GetBothExchangeRateInstructionArgs> {
    return getStructEncoder([['nonce', getU16Encoder()]]);
}

function getGetBothExchangeRateInstructionDataDecoder(): Decoder<GetBothExchangeRateInstructionArgs> {
    return getStructDecoder([['nonce', getU16Decoder()]]);
}

export interface ParsedGetBothExchangeRateInstruction {
    programId: Address;
    accounts: {
        oracle: AccountMeta;
    };
    data: GetBothExchangeRateInstructionArgs;
}

export function parseGetBothExchangeRateInstruction(
    instruction: TransactionInstruction,
): ParsedGetBothExchangeRateInstruction {
    if (instruction.keys.length < 1) {
        throw new Error('Expected 1 account metas for GetBothExchangeRate instruction');
    }
    if (
        !GET_BOTH_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('GetBothExchangeRate instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            oracle: instruction.keys[0]!,
        },
        data: getGetBothExchangeRateInstructionDataDecoder().decode(instructionData),
    };
}

export function createGetBothExchangeRateInstruction(
    accounts: GetBothExchangeRateInstructionAccounts,
    args: GetBothExchangeRateInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    let data = Buffer.from(getGetBothExchangeRateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_BOTH_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
