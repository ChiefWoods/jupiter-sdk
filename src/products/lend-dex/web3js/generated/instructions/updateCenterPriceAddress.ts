import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_CENTER_PRICE_ADDRESS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    45, 110, 96, 39, 201, 250, 142, 1,
]);

export interface UpdateCenterPriceAddressInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateCenterPriceAddressInstructionArgs {
    centerPriceAddress: Address;
    percent: number;
    time: number;
}

function getUpdateCenterPriceAddressInstructionDataEncoder(): Encoder<UpdateCenterPriceAddressInstructionArgs> {
    return getStructEncoder([
        [
            'centerPriceAddress',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
        ['percent', getU32Encoder()],
        ['time', getU32Encoder()],
    ]);
}

function getUpdateCenterPriceAddressInstructionDataDecoder(): Decoder<UpdateCenterPriceAddressInstructionArgs> {
    return getStructDecoder([
        ['centerPriceAddress', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['percent', getU32Decoder()],
        ['time', getU32Decoder()],
    ]);
}

export interface ParsedUpdateCenterPriceAddressInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
    };
    data: UpdateCenterPriceAddressInstructionArgs;
}

export function parseUpdateCenterPriceAddressInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateCenterPriceAddressInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UpdateCenterPriceAddress instruction');
    }
    if (
        !UPDATE_CENTER_PRICE_ADDRESS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateCenterPriceAddress instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
        },
        data: getUpdateCenterPriceAddressInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateCenterPriceAddressInstruction(
    accounts: UpdateCenterPriceAddressInstructionAccounts,
    args: UpdateCenterPriceAddressInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateCenterPriceAddressInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_CENTER_PRICE_ADDRESS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
