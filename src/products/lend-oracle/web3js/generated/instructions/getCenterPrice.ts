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

export const GET_CENTER_PRICE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([60, 51, 11, 241, 151, 180, 192, 27]);

export interface GetCenterPriceInstructionAccounts {
    oracle: Address;
}

export interface GetCenterPriceInstructionArgs {
    nonce: number;
}

function getGetCenterPriceInstructionDataEncoder(): Encoder<GetCenterPriceInstructionArgs> {
    return getStructEncoder([['nonce', getU16Encoder()]]);
}

function getGetCenterPriceInstructionDataDecoder(): Decoder<GetCenterPriceInstructionArgs> {
    return getStructDecoder([['nonce', getU16Decoder()]]);
}

export interface ParsedGetCenterPriceInstruction {
    programId: Address;
    accounts: {
        oracle: AccountMeta;
    };
    data: GetCenterPriceInstructionArgs;
}

export function parseGetCenterPriceInstruction(instruction: TransactionInstruction): ParsedGetCenterPriceInstruction {
    if (instruction.keys.length < 1) {
        throw new Error('Expected 1 account metas for GetCenterPrice instruction');
    }
    if (!GET_CENTER_PRICE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('GetCenterPrice instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            oracle: instruction.keys[0]!,
        },
        data: getGetCenterPriceInstructionDataDecoder().decode(instructionData),
    };
}

export function createGetCenterPriceInstruction(
    accounts: GetCenterPriceInstructionAccounts,
    args: GetCenterPriceInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    let data = Buffer.from(getGetCenterPriceInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_CENTER_PRICE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
