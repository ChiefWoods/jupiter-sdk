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

export const GET_EXCHANGE_RATE_LIQUIDATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([228, 169, 73, 39, 91, 82, 27, 5]);

export interface GetExchangeRateLiquidateInstructionAccounts {
    oracle: Address;
}

export interface GetExchangeRateLiquidateInstructionArgs {
    nonce: number;
}

function getGetExchangeRateLiquidateInstructionDataEncoder(): Encoder<GetExchangeRateLiquidateInstructionArgs> {
    return getStructEncoder([['nonce', getU16Encoder()]]);
}

function getGetExchangeRateLiquidateInstructionDataDecoder(): Decoder<GetExchangeRateLiquidateInstructionArgs> {
    return getStructDecoder([['nonce', getU16Decoder()]]);
}

export interface ParsedGetExchangeRateLiquidateInstruction {
    programId: Address;
    accounts: {
        oracle: AccountMeta;
    };
    data: GetExchangeRateLiquidateInstructionArgs;
}

export function parseGetExchangeRateLiquidateInstruction(
    instruction: TransactionInstruction,
): ParsedGetExchangeRateLiquidateInstruction {
    if (instruction.keys.length < 1) {
        throw new Error('Expected 1 account metas for GetExchangeRateLiquidate instruction');
    }
    if (
        !GET_EXCHANGE_RATE_LIQUIDATE_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('GetExchangeRateLiquidate instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            oracle: instruction.keys[0]!,
        },
        data: getGetExchangeRateLiquidateInstructionDataDecoder().decode(instructionData),
    };
}

export function createGetExchangeRateLiquidateInstruction(
    accounts: GetExchangeRateLiquidateInstructionAccounts,
    args: GetExchangeRateLiquidateInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    let data = Buffer.from(getGetExchangeRateLiquidateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_EXCHANGE_RATE_LIQUIDATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
