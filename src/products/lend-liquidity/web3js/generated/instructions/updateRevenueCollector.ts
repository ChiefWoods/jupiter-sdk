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

export const UPDATE_REVENUE_COLLECTOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    167, 142, 124, 240, 220, 113, 141, 59,
]);

export interface UpdateRevenueCollectorInstructionAccounts {
    authority: Address;
    liquidity: Address;
}

export interface UpdateRevenueCollectorInstructionArgs {
    revenueCollector: Address;
}

function getUpdateRevenueCollectorInstructionDataEncoder(): Encoder<UpdateRevenueCollectorInstructionArgs> {
    return getStructEncoder([
        [
            'revenueCollector',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
    ]);
}

function getUpdateRevenueCollectorInstructionDataDecoder(): Decoder<UpdateRevenueCollectorInstructionArgs> {
    return getStructDecoder([
        ['revenueCollector', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateRevenueCollectorInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        liquidity: AccountMeta;
    };
    data: UpdateRevenueCollectorInstructionArgs;
}

export function parseUpdateRevenueCollectorInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateRevenueCollectorInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateRevenueCollector instruction');
    }
    if (
        !UPDATE_REVENUE_COLLECTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateRevenueCollector instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
        },
        data: getUpdateRevenueCollectorInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateRevenueCollectorInstruction(
    accounts: UpdateRevenueCollectorInstructionAccounts,
    args: UpdateRevenueCollectorInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateRevenueCollectorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_REVENUE_COLLECTOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
