import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_EXCHANGE_PRICE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([239, 244, 10, 248, 116, 25, 53, 150]);

export interface UpdateExchangePriceInstructionAccounts {
    tokenReserve: Address;
    rateModel: Address;
}

export interface UpdateExchangePriceInstructionArgs {
    mint: Address;
}

function getUpdateExchangePriceInstructionDataEncoder(): Encoder<UpdateExchangePriceInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateExchangePriceInstructionDataDecoder(): Decoder<UpdateExchangePriceInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateExchangePriceInstruction {
    programId: Address;
    accounts: {
        tokenReserve: AccountMeta;
        rateModel: AccountMeta;
    };
    data: UpdateExchangePriceInstructionArgs;
}

export function parseUpdateExchangePriceInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateExchangePriceInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateExchangePrice instruction');
    }
    if (!UPDATE_EXCHANGE_PRICE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateExchangePrice instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenReserve: instruction.keys[0]!,
            rateModel: instruction.keys[1]!,
        },
        data: getUpdateExchangePriceInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateExchangePriceInstruction(
    accounts: UpdateExchangePriceInstructionAccounts,
    args: UpdateExchangePriceInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateExchangePriceInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_EXCHANGE_PRICE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
